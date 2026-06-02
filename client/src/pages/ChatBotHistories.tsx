import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAuth from "../services/auth.services";
import DataModifier from "../services/data.services";
import type { ChatBotIntrf } from "../models/chatbot-model";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import ChatBotList from "../components/ChatBotList";

export default function ChatBotHistories() {
    const queryClient = useQueryClient();
    const { currentUserId } = useAuth();
    const { deleteData, infiniteScroll, message, setMessage } = DataModifier();
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const { error, fetchNextPage, isFetchingNextPage, isLoading, isReachedEnd, paginatedData } = infiniteScroll<ChatBotIntrf>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/all-chat-histories/${currentUserId}`,
        limit: 14,
        query_key: [`chat-histories-${currentUserId}`],
        stale_time: 1800000
    });

    const deleteAllChatMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => await deleteData({
            api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/remove-all/${currentUserId}`
        }),
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`chat-histories-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteChatMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => await deleteData({
            api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/remove/${id}`
        }),
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`chat-histories-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false),
    });
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            {message ? Notification(message) : null}
            <div className="flex flex-col h-full min-h-[200px] gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="flex justify-center">
                    <button 
                        type="button" 
                        className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white text-gray-700 font-medium p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                        disabled={isProcessing}
                        onClick={() => deleteAllChatMt.mutate()}
                    >
                        Delete All</button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full"><Loading/></div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <span className="text-white font-medium text-5xl">{error.message}</span>
                    </div>
                ) : (
                    <ChatBotList
                        chats={paginatedData}
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        isReachedEnd={isReachedEnd}
                        onDelete={deleteChatMt}
                    />
                )}
            </div>
        </div>
    );
}