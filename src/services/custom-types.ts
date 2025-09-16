import type { OrderByDirection, WhereFilterOp } from "firebase/firestore";

export type IInsertData<T> = {
    collection_name: string;
    new_data: Omit<T, 'id' | 'created_at'>;
}

export type IDeleteData = {
    collection_name: string;
    values?: string;
    filters?: [string, WhereFilterOp, any][];
}

export type IRealTime = {
    collection_name: string; 
    filters: [string, WhereFilterOp, any][]; 
    order_by_options?: [string, OrderByDirection][];
    items_each_page: number;
}

export type IUpdateData<T> = {
    collection_name: string;
    values: string;
    new_data: Partial<Omit<T, 'id' | 'created_at'>>;
}

export type IActivity = {
    id: string;
    created_at: Date;
    activity_name: string;
    schedule: Date;
    user_id: string;
}

export type IBalance = {
    id: string;
    created_at: Date;
    description: string;
    balance_type: 'income' | 'expense';
    amount: number;
    user_id: string;
}

export type INote = {
    id: string;
    created_at: Date;
    note_title: string;
    note_content: string;
    user_id: string;
}