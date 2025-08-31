import { useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from './supabase-config';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { DatabaseProps, DeleteDataProps, InsertDataProps, UpdateDataProps, UpsertDataProps } from './custom-types';

export const useSupabaseTable = <B extends { id: string; created_at?: Date | string }>() => {
    const queryClient = useQueryClient();
    const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
    const isInitializedRef = useRef(false);

    // Cleanup function
    const teardownStorage = useCallback(() => {
        if (realtimeChannelRef.current) {
            realtimeChannelRef.current.unsubscribe();
            realtimeChannelRef.current = null;
        }
        isInitializedRef.current = false;
    }, []);

    // Transform data function
    const transformData = useCallback((data: any): B => {
        if (data && data.created_at && typeof data.created_at === 'string') {
            return { ...data, created_at: new Date(data.created_at) } as B;
        }
        return data as B;
    }, []);

    // Fetch initial data
    const fetchData = useCallback(async (props: DatabaseProps<B>) => {
        let query = supabase.from(props.tableName).select(props.relationalQuery || '*');

        if (props.additionalQuery) query = props.additionalQuery(query);

        const { data, error } = await query;

        if (error) throw new Error(`Error fetching data: ${error.message}`);

        return data.map(transformData);
    }, [transformData]);

    // Realtime initialization
    const realtimeInit = useCallback(async (props: DatabaseProps<B>) => {
        teardownStorage();
        const queryKey = [props.tableName, props.uniqueQueryKey];

        realtimeChannelRef.current = supabase.channel(`db_${props.tableName}`);
        realtimeChannelRef.current.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: props.tableName },
            async (payload: RealtimePostgresChangesPayload<B>) => {
                const queryKey = [props.tableName, props.uniqueQueryKey];
                switch (payload.eventType) {
                    case 'INSERT': {
                        let query = supabase
                        .from(props.tableName)
                        .select(props.relationalQuery || '*')
                        .eq('id', payload.new.id)
                        .single();

                        if (props.additionalQuery) query = props.additionalQuery(query);

                        const { data, error } = await query;

                        if (error) throw new Error('Error fetching inserted data');

                        const transformedData = transformData(data);
                        
                        // Update the query data optimistically
                        queryClient.setQueryData<B[]>(queryKey, (oldData = []) => {
                            // Check if the data already exists to avoid duplicates
                            if (!oldData.find(item => item.id === transformedData.id)) {
                                return [...oldData, transformedData];
                            }
                            return oldData;
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

                        const { data, error } = await query;

                        if (error) throw new Error('Error fetching updated data');

                        const transformedData = transformData(data);
                        
                        queryClient.setQueryData<B[]>(queryKey, (oldData = []) => 
                            oldData.map(item => item.id === transformedData.id ? transformedData : item)
                        );
                        break;
                    }
                    case 'DELETE': {
                        const deletedId = payload.old.id;
                        
                        queryClient.setQueryData<B[]>(queryKey, (oldData = []) => 
                            oldData.filter(item => item.id !== deletedId)
                        );
                        break;
                    }
                }

                if (props.callback) {
                    const currentData = queryClient.getQueryData<B[]>(queryKey) || [];
                    props.callback(currentData);
                }
            }
        );

        // Subscribe to the channel
        realtimeChannelRef.current.subscribe();
        isInitializedRef.current = true;

        // Fetch initial data
        const data = await fetchData(props);
        queryClient.setQueryData(queryKey, data);
        
        if (props.callback) props.callback(data);
    }, [fetchData, queryClient, teardownStorage, transformData]);

    const initTableData = (props: DatabaseProps<B>) => {
        return useQuery({
            queryKey: [props.tableName, props.uniqueQueryKey],
            queryFn: () => fetchData(props),
            enabled: false, 
        });
    }

    const insertData = () => {
        return useMutation({
            mutationFn: async (props: InsertDataProps<B>) => {
                const { data, error } = await supabase
                .from(props.tableName)
                .insert([props.newData])
                .select();

                if (error) throw new Error(`Failed to insert data: ${error.message}`);
                return data[0];
            },
        });
    }

    const upsertData = () => {
        return useMutation({
            mutationFn: async (props: UpsertDataProps<B>) => {
                const { data, error } = await supabase
                .from(props.tableName)
                .upsert([props.dataToUpsert])
                .select()
                .single();

                if (error) throw new Error(`Failed to upsert data: ${error.message}`);
                return data;
            },
        });
    }

    const updateData = () => {
        return useMutation({
            mutationFn: async (props: UpdateDataProps<B>) => {
                const { error } = await supabase
                .from(props.tableName)
                .update(props.newData)
                .eq('id', props.values);

                if (error) throw new Error(error.message);
            },
        });
    }

    const deleteData = () => {
        return useMutation({
            mutationFn: async (props: DeleteDataProps) => {
                if (props.column !== undefined) {
                    if (Array.isArray(props.values)) {
                        const { error } = await supabase
                        .from(props.tableName)
                        .delete()
                        .in(props.column, props.values);

                        if (error) throw new Error(error.message);
                    } else if (typeof props.values === 'string') {
                        const { error } = await supabase
                        .from(props.tableName)
                        .delete()
                        .eq(props.column, props.values);

                        if (error) throw new Error(error.message);
                    } else {
                        const { error } = await supabase
                        .from(props.tableName)
                        .delete()
                        .not(props.column, 'is', null);

                        if (error) throw new Error(error.message);
                    }
                }
            },
        });
    }

    // Effect for cleanup when component unmounts
    useEffect(() => {
        return () => teardownStorage();
    }, [teardownStorage]);

    return {
        realtimeInit,
        teardownStorage,
        initTableData,
        insertData,
        upsertData,
        updateData,
        deleteData,
    }
}