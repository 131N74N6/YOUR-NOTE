import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type INote = {
    _id: string;
    created_at: string;
    note_title: string;
    note_content: string;
    user_id: string;
}

export type NoteItemProps = {
    note: INote;
    onDelete: UseMutationResult<void, Error, string, void>;
}

export type NoteListProps = {
    notes: INote[];
    onDelete: UseMutationResult<void, Error, string, void>;
    isReachedEnd: boolean;
    isLoadMore: boolean;
    getMore: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
}