import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { GetDataProps, IDeleteApi, InfiniteScrollProps, IPostApi, IPutApi } from "./custom-types";
import useAuth from "./auth-services";
import { useState } from "react";

export default function DataModifier() {
    const { loading, currentUser } = useAuth();
    const token = currentUser && currentUser.token;
    const [message, setMessage] = useState<string | null>(null);

    const deleteData = async(props: IDeleteApi): Promise<void> => {
        try {
            const request = await fetch(props.api_url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.message || 'Failed to delete data. Try again later';
                setMessage(errorMessage);
                throw new Error(errorMessage);
            } else {
                setMessage(response.message);
                return response;
            }
        } catch (error: any) {
            setMessage(error.message || 'Check Your Network Connection');
            throw error;
        }
    }

    const getData = <HX>(props: GetDataProps) => {
        const { data, error, isLoading } = useQuery<HX, Error>({
            enabled: !loading && !!token,
            queryFn: async () => {
                const request = await fetch(props.api_url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const response = await request.json();
                return response;
            },
            queryKey: props.query_key,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: props.stale_time
        });

        return { data, error, isLoading }
    }

    const infiniteScroll = <LV>(props: InfiniteScrollProps) => {
        const fetchData = async ({ pageParam = 1 }: { pageParam?: number }) => {
            const request = await fetch(`${props.api_url}?page=${pageParam}&limit=${props.limit}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET'
            });

            const response = await request.json();
            return response;
        }

        const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
            enabled: !loading && !!token,
            queryKey: props.query_key,
            queryFn: fetchData,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < props.limit) return;
                return allPages.length + 1;
            },
            initialPageParam: 1,
            staleTime: props.stale_time,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
        });

        const paginatedData: LV[] = data ? data.pages.flat() : [];
        const isReachedEnd = !hasNextPage;

        return { paginatedData, error, fetchNextPage, isFetchingNextPage, isLoading, isReachedEnd }
    }

    const insertData = async <HX>(props: IPostApi<HX>): Promise<void> => {
        try {
            const request = await fetch(props.api_url, { 
                method: 'POST', 
                body: JSON.stringify(props.api_data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.message || 'Failed to insert data. Try again later';
                setMessage(errorMessage);
                throw new Error(errorMessage);
            } else {
                setMessage(response.message);
                return response;
            }
        } catch (error: any) {
            setMessage(error.message || 'Check Your Network Connection');
            throw error;
        }
    }

    const updateData = async <HX>(props: IPutApi<HX>): Promise<void> => {
        try {
            const request = await fetch(props.api_url, { 
                method: 'PUT', 
                body: JSON.stringify(props.api_data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.message || 'Failed to update data. Try again later';
                setMessage(errorMessage);
                throw new Error(errorMessage);
            } else {
                setMessage(response.message);
                return response;
            }
        } catch (error: any) {
            setMessage(error.message || 'Check Your Network Connection');
            throw error;
        }
    }

    return { deleteData, getData, infiniteScroll, insertData, message, setMessage, updateData }
}