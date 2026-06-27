import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export type ChatBotIntrf = {
    _id: string;
    created_at: string;
    answer: string;
    question: string;
    user_id: string;
}

export type ChatBotItemIntrf = {
    chat: ChatBotIntrf;
    onDelete: UseMutationResult<void, Error, string, void>;
}

export type ChatBotListIntrf = {
    chats: ChatBotIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    isFetchingNextPage: boolean;
    isReachedEnd: boolean;
    onDelete: UseMutationResult<void, Error, string, void>;
}