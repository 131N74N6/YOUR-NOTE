import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

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
    onDelete: UseMutationResult<void, Error, string, void>;
    onSelect: (id: string) => void;
    onUpdate: UseMutationResult<void, Error, UpdateActivityDataProps, void>;
    isDataChanging: boolean;
}

export type ActivityListProps = {
    selectedId: string | null;
    act_datas: IActivity[];
    onDelete: UseMutationResult<void, Error, string, void>;
    onSelect: (id: string) => void;
    onUpdate: UseMutationResult<void, Error, UpdateActivityDataProps, void>;
    isDataChanging: boolean;
    isReachedEnd: boolean;
    isLoadMore: boolean;
    getMore: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}

export type UpdateActivityDataProps = {
    _id: string;
    act_name: string;
    schedule_at: string;
}