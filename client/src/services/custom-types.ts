import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

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

export type UpdateActivityDataProps = {
    _id: string;
    act_name: string;
    schedule_at: string;
}

export type UpdateBalanceProps = {
    _id: string;
    amount: number; 
    balance_type: 'income' | 'expense'; 
    description: string;
}

export type GetDataProps = {
    api_url: string; 
    query_key: string[]; 
    stale_time: number;
}

export interface IUser {
    message: string;
    token: string;
    info: {
        id: string;
        email: string;
        username: string;
    }
}

export type ErrorPage = {
    message: string;
}

export type ActivityFormProps = {
    act_name: string;
    schedule_at: string;
    changeActName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    makeSchedule: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSave: (event: React.FormEvent) => void;
    isDataChanging: boolean;
}

export type IActivity = {
    _id: string;
    act_name: string;
    created_at: string;
    schedule_at: string;
    user_id: string;
}

export type ActivityItemProps = {
    selected_act: IActivity;
    is_selected: boolean;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    onUpdate: (selected: UpdateActivityDataProps) => void;
    isDataChanging: boolean;
}

export type ActivityListProps = {
    selectedId: string | null;
    act_data: IActivity[];
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    onUpdate: (selected: UpdateActivityDataProps) => void;
    isDataChanging: boolean;
    isReachedEnd: boolean;
    isLoadMore: boolean;
    getMore: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}

export type BalanceFormProps = {
    onSave: (event: React.FormEvent) => void;
    onClose: () => void;
    amount: number;
    changeAmount: (event: React.ChangeEvent<HTMLInputElement>) => void;
    balance_type: 'income' | 'expense';
    changeToIncome: () => void;
    changeToExpense: () => void;
    description: string;
    changeDescription: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isDataChanging: boolean;
}

export type IBalance = {
    _id: string;
    created_at: string;
    description: string;
    balance_type: 'income' | 'expense';
    amount: number;
    user_id: string;
}

export type BalanceListProps = {
    data: IBalance[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onUpdate: (selected: UpdateBalanceProps) => void;
    onDelete: (id: string) => void;
    isDataChanging: boolean;
    isReachedEnd: boolean;
    isLoadMore: boolean;
    getMore: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}

export type BalanceItemProps = {
    selected_data: IBalance;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdate: (selected: UpdateBalanceProps) => void;
    onDelete: (id: string) => void;
    isDataChanging: boolean;
}

export type INote = {
    _id: string;
    created_at: string;
    note_title: string;
    note_content: string;
    user_id: string;
}

export type NoteItemProps = {
    note: INote;
    onDelete: (id: string) => void;
}

export type NoteListProps = {
    notes: INote[];
    onDelete: (id: string) => void;
    isReachedEnd: boolean;
    isLoadMore: boolean;
    getMore: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}