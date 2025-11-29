import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { GetDataProps, IDeleteApi, InfiniteScrollProps, IPostApi, IPutApi } from "./custom-types";
import useAuth from "./useAuth";

export default function DataModifier() {
    const { loading, user } = useAuth();
    const token = user && user.token;

    const deleteData = async(props: IDeleteApi): Promise<void> => {
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
            enabled: !loading && !!token,
            gcTime: 540000,
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
            gcTime: 540000,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
        });

        const paginatedData: LV[] = data ? data.pages.flat() : [];
        const isReachedEnd = !hasNextPage;

        return { paginatedData, error, fetchNextPage, isFetchingNextPage, isLoading, isReachedEnd }
    }

    const insertData = async <HX>(props: IPostApi<HX>): Promise<void> => {
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

    const updateData = async <HX>(props: IPutApi<HX>): Promise<void> => {
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