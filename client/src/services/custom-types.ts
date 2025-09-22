export type IDeleteApi = IGetApi;

export type IGetApi = {
    api_url: string;
}

export type IPostApi<I> = {
    api_url: string;
    api_data: Omit<I, 'id'>;
}

export type IPutApi<I> = {
    api_url: string;
    api_data: Partial<Omit<I, 'id'>>;
}

export type User = {
    id: string;
    email: string;
    username: string;
    token: string;
}

export type ErrorPage = {
    message: string;
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
    activity_name: string;
    created_at: string;
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
}