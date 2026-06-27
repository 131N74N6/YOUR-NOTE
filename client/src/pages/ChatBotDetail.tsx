import { useParams } from "react-router-dom";
import { Navbar2, Navbar1 } from "../components/Navbar";
import DataModifier from "../services/data.service";
import type { ChatBotIntrf } from "../models/chatbot.model";
import Loading from "../components/Loading";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import { useMemo } from "react";

export default function ChatBotDetail() {
    const { _id } = useParams();
    const { getData } = DataModifier();

    const  { data: chatData, error, isLoading } = getData<ChatBotIntrf[]>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/detail/${_id}`,
        query_key: [`chat-detail-${_id}`],
        stale_time: Infinity
    });

    const sanitizedAnswer = useMemo(() => {
        if (!chatData) return '';
        return DOMPurify.sanitize(chatData?.[0]?.answer, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [chatData?.[0]?.answer, _id]);
    
    return (
        <section className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="flex flex-col h-full overflow-y-auto gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-50">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full"><Loading/></div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <span className="text-white font-bold text-5xl">{error.message}</span>
                    </div>
                ) : chatData ? (
                    <div className="flex flex-col gap-4">
                        <div className="text-white font-bold text-2xl">{chatData?.[0]?.question}</div>
                        <div className="text-white">{chatData?.[0]?.created_at}</div>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                // Custom styling untuk elemen Markdown
                                p: ({node, ...props}) => <p className="text-gray-100 my-2 leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="text-gray-100 list-disc pl-5 my-2 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="text-gray-100 list-decimal pl-5 my-2 space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="text-gray-100" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                                em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
                                code: ({node, inline, className, children, ...props}: any) => 
                                    inline ? (
                                        <code className="bg-gray-200 text-pink-300 px-1 py-0.5 rounded text-sm" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <pre className="bg-gray-100 border border-gray-700 rounded p-3 overflow-x-auto my-3">
                                            <code className={className} {...props}>{children}</code>
                                        </pre>
                                    ),
                                blockquote: ({node, ...props}) => 
                                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 my-3" {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mt-4 mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-white mt-3 mb-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-base font-medium text-white mt-2 mb-1" {...props} />,
                            }}
                        >
                            {sanitizedAnswer}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <span className="text-white font-bold text-5xl">This chat has been deleted or does not exist.</span>
                    </div>
                )}
            </div>
        </section>
    )
}