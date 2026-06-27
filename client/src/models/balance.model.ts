import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

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

export type BalanceListProps = {
    balances: IBalance[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onUpdate: UseMutationResult<void, Error, UpdateBalanceProps, void>;
    onDelete: UseMutationResult<void, Error, string, void>;
    isDataChanging: boolean;
    isReachedEnd: boolean;
    isLoadMore: boolean;
    getMore: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}

export type BalanceItemProps = {
    selected_data: IBalance;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdate: UseMutationResult<void, Error, UpdateBalanceProps, void>;
    onDelete: UseMutationResult<void, Error, string, void>;
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

export type IBalanceSummary = {
    income: number;
    expense: number;
    balance: number;
}

export type UpdateBalanceProps = {
    _id: string;
    amount: number; 
    balance_type: 'income' | 'expense'; 
    description: string;
}