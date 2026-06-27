import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { GetDataProps, IDeleteApi, InfiniteScrollProps, IPostApi, IPutApi } from "../models/data.model";
import useAuth from "./auth.service";
import { useState } from "react";

export default function DataModifier() {
    const { isSigningIn, currentUserId } = useAuth();
    const [message, setMessage] = useState<string | null>(null);

    const deleteData = async (props: IDeleteApi) => {
        try {
            const request = await fetch(props.api_url, {
                credentials: 'include',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.message || 'Failed to delete data. Try again later';
                throw new Error(errorMessage);
            } else {
                return response;
            }
        } catch (error: any) {
            throw error;
        }
    }

    const getData = <HX>(props: GetDataProps) => {
        const { data, error, isLoading } = useQuery<HX, Error>({
            enabled: !isSigningIn && !!currentUserId,
            queryFn: async () => {
                try {
                    const request = await fetch(props.api_url, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'GET'
                    });

                    const response = await request.json();

                    if (!request.ok) {
                        const errorMessage = response.message || 'Failed to fetch data. Try again later';
                        throw new Error(errorMessage);
                    } 
                    return response;
                } catch (error) {
                    throw error;
                }
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
        const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
            enabled: !isSigningIn && !!currentUserId,
            queryKey: props.query_key,
            queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
                try {
                    const request = await fetch(`${props.api_url}?page=${pageParam}&limit=${props.limit}`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'GET'
                    });

                    const response = await request.json();
                    
                    if (!request.ok) {
                        const errorMessage = response.message || 'Failed to fetch data. Try again later';
                        throw new Error(errorMessage);
                    } 
                    return response;
                } catch (error) {
                    throw error;
                }
            },
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

    const insertData = async <HX>(props: IPostApi<HX>) => {
        try {
            const request = await fetch(props.api_url, { 
                body: JSON.stringify(props.api_data),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.message || 'Failed to insert data. Try again later';
                throw new Error(errorMessage);
            } else {
                return response;
            }
        } catch (error: any) {
            throw error;
        }
    }

    const updateData = async <HX>(props: IPutApi<HX>) => {
        try {
            const request = await fetch(props.api_url, { 
                body: JSON.stringify(props.api_data),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT'
            });

            const response = await request.json();

            if (!request.ok) {
                const errorMessage = response.message || 'Failed to update data. Try again later';
                throw new Error(errorMessage);
            } else {
                return response;
            }
        } catch (error: any) {
            throw error;
        }
    }

    return { deleteData, getData, infiniteScroll, insertData, message, setMessage, updateData }
}