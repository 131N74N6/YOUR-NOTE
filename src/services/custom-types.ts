import type { OrderByDirection, WhereFilterOp } from "firebase/firestore";

export type ErrorPage = {
    message: string;
}

export type IGetSelectedData = {
    collection_name: string;
    values: string;
}

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
}

export type IUpdateData<T> = {
    collection_name: string;
    values: string;
    new_data: Partial<Omit<T, 'id' | 'created_at'>>;
}

export type ActivityFormProps = {
    act_name: string;
    schedule: string;
    changeActName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    makeSchedule: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSave: (event: React.FormEvent) => void;
}

export type IActivity = {
    id: string;
    created_at: Date;
    activity_name: string;
    schedule: string;
    user_id: string;
}

export type ActivityItemProps = {
    selected_act: IActivity;
    is_selected: boolean;
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    onUpdate: (id: string, changeAct: { 
        activity_name: string; 
        schedule: string; 
    }) => Promise<void>;
}

export type ActivityListProps = {
    selectedId: string | null;
    act_data: IActivity[];
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    onUpdate: (id: string, changeAct: { 
        activity_name: string; 
        schedule: string; 
    }) => Promise<void>;
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
}

export type IBalance = {
    id: string;
    created_at: Date;
    description: string;
    balance_type: 'income' | 'expense';
    amount: number;
    user_id: string;
}

export type BalanceListProps = {
    data: IBalance[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onUpdate: (id: string, 
        data: { 
            amount: number; 
            balance_type: 'income' | 'expense'; 
            description: string 
        }
    ) => Promise<void>;
    onDelete: (id: string) => void;
}

export type BalanceItemProps = {
    selected_data: IBalance;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdate: (id: string, 
        data: { 
            amount: number; 
            balance_type: 'income' | 'expense'; 
            description: string 
        }
    ) => Promise<void>;
    onDelete: (id: string) => void;
}

export type INote = {
    id: string;
    created_at: Date;
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
}

export type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
}

export type SummarizeData = {
    collection_name: string;
    field1: string;
    field2: string;
    sign: WhereFilterOp;
    values: string;
}

export type ITotalData = {
    collection_name: string;
    field1: string;
    sign: WhereFilterOp;
    values: string;
}