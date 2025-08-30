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
        .channel(`db_${props.tableName}`)
        .on(
            'postgres_changes',
            { 
                event: '*',
                schema: 'public',
                table: props.tableName,
            },
            async (payload: RealtimePostgresChangesPayload<B>) => {
                switch (payload.eventType) {
                    case 'INSERT': {
                        let query = supabase
                        .from(props.tableName)
                        .select(props.relationalQuery || '*')
                        .eq('id', payload.new.id)
                        .single();
                        
                        if (props.additionalQuery) query = props.additionalQuery(query);
                        
                        const { data: newData, error } = await query;
                        if (error) throw new Error('Failed fetching inserted data');
                        
                        const transformedData = transformsData(newData) as B;
                        queryClient.setQueryData(queryKey, (old: B[] = []) => {
                            if (old.some(item => item.id === transformedData.id)) {
                                return old;
                            }
                            return [...old, transformedData];
                        });
                        break;
                    }
                    case 'UPDATE': {
                        let query = supabase
                        .from(props.tableName)
                        .select(props.relationalQuery || '*')
                        .eq('id', payload.new.id)
                        .single();
                        
                        if (props.additionalQuery) query = props.additionalQuery(query);
                        
                        const { data: updatedData, error } = await query;
                        if (error) throw new Error ('Failed fetching updated data');
                        
                        const transformedData = transformsData(updatedData) as B;
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

        // Cleanup subscription
        return () => {
            supabase.removeChannel(channel);
        };
    }, [props.tableName, queryClient, queryKey, props.uniqueQueryKey, props.additionalQuery, props.relationalQuery]);

    const insertMutation = useMutation({
        mutationFn: async (props: InsertDataProps<B>) => {
            const { data, error } = await supabase
            .from(props.tableName)
            .insert([props.newData])
            .select();
            
            if (error) throw new Error('Failed to add new data');
            return data[0];
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const updateMutation = useMutation({
        mutationFn: async (props: UpdateDataProps<B>) => {
            const { error } = await supabase
            .from(props.tableName)
            .update(props.newData)
            .eq(props.column, props.values);
            
            if (error) throw new Error('Failed to change data');
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const upsertMutation = useMutation({
        mutationFn: async (props: UpsertDataProps<B>) => {
            const { data, error } = await supabase
            .from(props.tableName)
            .upsert([props.dataToUpsert])
            .select()
            .single();

            if (error) throw new Error('Failed to process data');
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    })

    const deleteMutation = useMutation({
        mutationFn: async (props: DeleteDataProps) => {
            if (props.column !== undefined) {
                if (Array.isArray(props.values)) {
                    const { error } = await supabase
                    .from(props.tableName)
                    .delete()
                    .in(props.column, props.values);
                    
                    if (error) throw new Error('Failed to delete data');
                } else if (typeof props.values === 'string') {
                    const { error } = await supabase
                    .from(props.tableName)
                    .delete()
                    .eq(props.column, props.values);
                    
                    if (error) throw new Error('Failed to delete data');
                } else {
                    const { error } = await supabase
                    .from(props.tableName)
                    .delete()
                    .not(props.column, 'is', null);
        
                    if (error) throw new Error('Failed to delete data');
                }
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
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