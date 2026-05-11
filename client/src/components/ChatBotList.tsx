import type { ChatBotListIntrf } from "../models/chatbot-model";
import ChatBotItem from "./ChatBotItem";
import Loading from "./Loading";

export default function ChatBotList(props: ChatBotListIntrf) {
    if (props.chats.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <span className="text-white font-[600] text-[1rem]">No chats found...</span>
            </div>
        )
    }

    return (
        <section className="flex flex-col gap-4 overflow-y-auto">
            <div className="grid gap-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                {props.chats.map((chat) => (
                    <ChatBotItem
                        key={`chat-${chat._id}`}
                        chat={chat}
                        onDelete={props.onDelete}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ? (
                    <span className="text-center"><Loading/></span>
                ) : props.chats.length < 14 ? (
                    <></>
                ) : props.isReachedEnd ? (
                    <span className="text-center text-white font-medium text-[1.5rem]">No More Chats</span>
                ) : (
                    <button
                        type='button'
                        className="bg-white text-gray-800 w-[120px] rounded font-[500] cursor-pointer p-[0.4rem] text-[0.9rem]"
                        onClick={() => props.fetchNextPage()}
                    >
                        Load More
                    </button>
                )}
            </div>
        </section>
    )
}
