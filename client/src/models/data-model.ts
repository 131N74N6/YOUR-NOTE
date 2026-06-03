export type IDeleteApi = {
    api_url: string;
}

export type IPostApi<I> = {
    api_url: string;
    api_data: Omit<I, '_id'>;
}

export type IPutApi<I> = {
    api_url: string;
    api_data: Partial<Omit<I, '_id'>>;
}

export type InfiniteScrollProps = {
    api_url: string; 
    query_key: string[]; 
    stale_time: number;
    limit: number;
}

export type GetDataProps = {
    api_url: string; 
    query_key: string[]; 
    stale_time: number;
}

export type NavbarIntrf = {
    is_processing?: boolean;
}