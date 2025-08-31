import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from './supabase-config';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { DatabaseProps, DeleteDataProps, InsertDataProps, UpdateDataProps, UpsertDataProps } from './custom-types';

export function useSupabaseTable<B extends { id: string }>(props: DatabaseProps) {
    const queryClient = useQueryClient();
    const queryKey = [props.tableName, ...(props.uniqueQueryKey || [])];

    const fetchData = async (): Promise<B[]> => {
        let query = supabase.from(props.tableName).select(props.relationalQuery || '*');
        
        if (props.additionalQuery) query = props.additionalQuery(query);
        
        const { data, error } = await query;

        if (error) throw new Error(error.message);
        
        return data.map(item => transformsData(item)) as B[];
    }

    // Menggunakan Tanstack Query untuk fetching data
    const { data, isLoading, error } = useQuery<B[], Error>({
        queryKey,
        queryFn: fetchData,
        staleTime: 5 * 60 * 1000,
    });

    // Setup realtime subscription
    useEffect(() => {
        const channel = supabase
        .channel(`db_${props.tableName}_${props.uniqueQueryKey?.join('_') || 'default'}`)
        .on(
            'postgres_changes',
            { 
                event: '*', 
                schema: 'public', 
                table: props.tableName,
                filter: props.filterKey || undefined
            },
            async (payload: RealtimePostgresChangesPayload<B>) => {
                switch (payload.eventType) {
                    case 'INSERT': {
                        // Optimistic update tanpa fetch tambahan
                        const transformedData = transformsData(payload.new) as B;
                        queryClient.setQueryData(queryKey, (old: B[] = []) => {
                            if (old.some(item => item.id === transformedData.id)) {
                                return old;
                            }
                            return [...old, transformedData];
                        });
                        break;
                    }
                    case 'UPDATE': {
                        // Langsung gunakan data dari payload tanpa fetch ulang
                        const transformedData = transformsData(payload.new) as B;
                        queryClient.setQueryData(queryKey, (old: B[] = []) => 
                            old.map(item => item.id === transformedData.id ? transformedData : item)
                        );
                        break;
                    }
                    case 'DELETE': {
                        const deletedId = payload.old.id;
                        queryClient.setQueryData(queryKey, (old: B[] = []) => 
                            old.filter(item => item.id !== deletedId)
                        );
                        break;
                    }
                }
            } 
        ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [
        props.tableName, queryClient, queryKey, 
        props.additionalQuery, props.relationalQuery, props.filterKey,
        props.uniqueQueryKey
    ]);

    const insertMutation = useMutation({
        mutationFn: async (props: InsertDataProps<B>) => {
            const { data, error } = await supabase
            .from(props.tableName)
            .insert([props.newData])
            .select();
            
            if (error) throw new Error(error.message);
            return data[0];
        },
        onSuccess: (newData) => {
            // Optimistic update
            queryClient.setQueryData(queryKey, (old: B[] = []) => {
                if (old.some(item => item.id === newData.id)) {
                    return old;
                }
                return [...old, transformsData(newData) as B];
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (props: UpdateDataProps<B>) => {
            const { data, error } = await supabase
            .from(props.tableName)
            .update(props.newData)
            .eq(props.column, props.values)
            .select()
            .single();
            
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (updatedData) => {
            // Optimistic update
            queryClient.setQueryData(queryKey, (old: B[] = []) => 
                old.map(item => item.id === updatedData.id ? transformsData(updatedData) as B : item)
            );
        },
    });

    const upsertMutation = useMutation({
        mutationFn: async (props: UpsertDataProps<B>) => {
            const { data, error } = await supabase
            .from(props.tableName)
            .upsert([props.dataToUpsert])
            .select()
            .single();

            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (upsertedData) => {
            // Optimistic update
            queryClient.setQueryData(queryKey, (old: B[] = []) => {
                const transformedData = transformsData(upsertedData) as B;
                const existingIndex = old.findIndex(item => item.id === transformedData.id);
                
                if (existingIndex >= 0) {
                    // Update existing
                    const newData = [...old];
                    newData[existingIndex] = transformedData;
                    return newData;
                } else {
                    // Add new
                    return [...old, transformedData];
                }
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (props: DeleteDataProps) => {
            if (props.column !== undefined) {
                let query = supabase
                    .from(props.tableName)
                    .delete();
                
                if (Array.isArray(props.values)) {
                    query = query.in(props.column, props.values);
                } else if (typeof props.values === 'string') {
                    query = query.eq(props.column, props.values);
                } else if (props.values !== undefined) {
                    query = query.not(props.column, 'is', null);
                }
                
                const { error } = await query;
                if (error) throw new Error(error.message);
            }
        },
        onSuccess: (_, variables) => {
            // Optimistic delete
            queryClient.setQueryData(queryKey, (old: B[] = []) => {
                if (Array.isArray(variables.values)) {
                    return old.filter(item => !variables.values?.includes(item.id));
                } else if (typeof variables.values === 'string') {
                    return old.filter(item => item.id !== variables.values);
                } else {
                    return old.filter(item => item[variables.column as keyof B] !== null);
                }
            });
        }
    });

    return {
        data: data || [],
        isLoading,
        error,
        insertData: insertMutation.mutateAsync,
        upsertData: upsertMutation.mutateAsync,
        updateData: updateMutation.mutateAsync,
        deleteData: deleteMutation.mutateAsync,
    }
}

function transformsData<B>(data: any): B {
    if (data && data.created_at && typeof data.created_at === 'string') {
        return { ...data, created_at: new Date(data.created_at) } as B;
    }
    return data as B;
}