import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { GetDataProps, IDeleteApi, InfiniteScrollProps, IPostApi, IPutApi } from "./custom-types";
import useAuth from "./useAuth";

export default function DataModifier() {
    const { user } = useAuth();
    const token = user && user.token;

    const deleteData = async(props: IDeleteApi) => {
        const request = await fetch(props.api_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        await request.json();
    }

    const getData = <HX>(props: GetDataProps) => {
        const { data, error, isLoading } = useQuery<HX, Error>({
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
            gcTime: 300000,
            staleTime: props.stale_time,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false
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
            queryKey: props.query_key,
            queryFn: fetchData,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length < props.limit) return;
                return allPages.length + 1;
            },
            initialPageParam: 1,
            staleTime: props.stale_time,
            gcTime: 300000,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
        });

        const paginatedData: LV[] = data ? data.pages.flat() : [];
        const isReachedEnd = !hasNextPage;

        return { paginatedData, error, fetchNextPage, isFetchingNextPage, isLoading, isReachedEnd }
    }

    const insertData = async <HX>(props: IPostApi<HX>) => {
        const request = await fetch(props.api_url, { 
            method: 'POST', 
            body: JSON.stringify(props.api_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        await request.json();
    }

    const updateData = async <HX>(props: IPutApi<HX>) => {
        const request = await fetch(props.api_url, { 
            method: 'PUT', 
            body: JSON.stringify(props.api_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        await request.json();
    }

    return { deleteData, getData, infiniteScroll, insertData, updateData }
}