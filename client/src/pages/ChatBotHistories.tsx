import { useEffect } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import ChatBotList from "../components/ChatBotList";
import ChatbotServices from "../services/chatbot.service";

export default function ChatBotHistories() {
    const { chatBotHistories, deleteAllChatMt, deleteChatMt, isProcessing, message, navigate, setMessage } = ChatbotServices();
    const { paginatedData, fetchNextPage, error, isLoading, isReachedEnd, isFetchingNextPage } = chatBotHistories;

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1 is_processing={isProcessing}/>
            <Navbar2 is_processing={isProcessing}/>
            {message ? Notification(message) : null}
            <div className="flex flex-col h-full min-h-[200px] gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-50">
                <div className="flex justify-center gap-2.5">
                    <button 
                        type="button" 
                        className="disabled:opacity-50 w-22 disabled:cursor-not-allowed cursor-pointer bg-white text-gray-700 font-medium p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                        disabled={isProcessing}
                        onClick={() => deleteAllChatMt.mutate()}
                    >
                        Delete All
                    </button>
                    <button 
                        type="button" 
                        className="disabled:opacity-50 w-22 disabled:cursor-not-allowed cursor-pointer bg-white text-gray-700 font-medium p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                        disabled={isProcessing}
                        onClick={() => navigate('/chat-bot')}
                    >
                        Back
                    </button>
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
        </section>
    );
}