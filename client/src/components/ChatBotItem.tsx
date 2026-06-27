import type { ChatBotItemIntrf } from "../models/chatbot.model";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import { useMemo } from "react";

export default function ChatBotItem(props: ChatBotItemIntrf) {
    const navigate = useNavigate();

    const sanitizedAnswer = useMemo(() => {
        if (!props.chat.answer) return '';
        
        return DOMPurify.sanitize(props.chat.answer, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [props.chat._id, props.chat.answer]);

    return (
        <div className="flex flex-col border border-white p-4 rounded-2xl gap-4">
            <div className="font-medium text-[1rem] text-white">{props.chat.question}</div>
            <div className="text-[1rem] text-white">{props.chat.created_at}</div>
            <div className="line-clamp-4">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        // Custom styling untuk elemen Markdown
                        p: ({node, ...props}) => <p className="text-white my-2 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="text-white list-disc pl-5 my-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="text-white list-decimal pl-5 my-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="text-white" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                        em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) => 
                            inline ? (
                                <code className="bg-gray-200 text-pink-300 px-1 py-0.5 rounded text-sm" {...props}>
                                    {children}
                                </code>
                            ) : (
                                <pre className="bg-white border border-gray-700 rounded p-3 overflow-x-auto my-3">
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
            <div className="flex gap-2 overflow-y-auto">
                <button
                    type="button"
                    onClick={() => navigate(`/detailed-chat/${props.chat._id}`)}
                    className="w-[88px] text-gray-800 bg-white cursor-pointer font-medium text-[0.8rem] p-[0.4rem] rounded-lg"
                >
                    See Details
                </button>
                <button
                    type="button"
                    onClick={() => props.onDelete.mutate(props.chat._id)}
                    className="w-[88px] text-gray-800 bg-white cursor-pointer font-medium text-[0.8rem] p-[0.4rem] rounded-lg"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}