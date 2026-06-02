import { useState, useEffect, useMemo } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import DataModifier from "../services/data.services";
import type { ChatBotIntrf, OpenRouterResponse } from "../models/chatbot-model";
import useAuth from "../services/auth.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "../components/Notification";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";

export default function ChatBot() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { currentUserId } = useAuth();
    const { insertData, message, setMessage } = DataModifier();
    
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const sanitizedAnswer = useMemo(() => {
        if (!answer) return '';
        // Sanitize HTML to prevent XSS, then allow safe markdown rendering
        return DOMPurify.sanitize(answer, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [answer]);

    const sendQuestionMt = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            const request = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemma-4-31b-it:free",
                    "messages": [{ 
                        "role": "user", 
                        "content": question.trim() 
                    }],
                    "reasoning": {"enabled": true}
                })
            });

            const response: OpenRouterResponse = await request.json();

            if (response.choices && response.choices.length > 0) {
                const messageContent = response.choices[0].message.content;
                console.log("Received message content:", messageContent);

                if (typeof messageContent === 'string') {
                    setAnswer(messageContent);
                    await insertData<ChatBotIntrf>({
                        api_url: `${import.meta.env.VITE_BASE_API_URL}/chatbot/send-question`, 
                        api_data: {
                            question: question.trim(),
                            answer: messageContent,
                            created_at: new Date().toISOString(),
                            user_id: currentUserId
                        }
                    });
                }
            }
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`chat-histories-${currentUserId}`] });
            setQuestion('');
        },
        onSettled: () => setIsProcessing(false)
    });

    const sendQuestion = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        sendQuestionMt.mutate();
    }

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);
    
    useEffect(() => {
        if (!currentUserId) {
            setAnswer('');
            setMessage(null);
            setQuestion('');
        }
    }, [currentUserId]);

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            {message ? Notification(message) : null}
            <div className="flex flex-col h-full gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="h-[80%] overflow-y-auto prose prose-invert prose-sm max-w-none 
                    prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white 
                    prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-gray-400
                    prose-code:bg-gray-800 prose-code:text-pink-300 prose-code:px-1 prose-code:rounded
                    prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:italic">
                    
                    {answer && (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                // Custom styling untuk elemen Markdown
                                p: ({node, ...props}) => <p className="text-gray-200 my-2 leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="text-gray-200 list-disc pl-5 my-2 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="text-gray-200 list-decimal pl-5 my-2 space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="text-gray-200" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                                em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
                                code: ({node, inline, className, children, ...props}: any) => 
                                    inline ? (
                                        <code className="bg-gray-800 text-pink-300 px-1 py-0.5 rounded text-sm" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <pre className="bg-gray-900 border border-gray-700 rounded p-3 overflow-x-auto my-3">
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
                    )}
                </div>
                <form onSubmit={sendQuestion} className="flex flex-col h-[20%] overflow-y-auto gap-[1rem] w-full backdrop-blur-sm backdrop-brightness-75">
                    <textarea 
                        value={question}
                        title="user-question"
                        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                sendQuestion(event);
                            }
                        }}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(event.target.value)}
                        className="resize-0 h-full overflow-y-auto border outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem] bg-transparent placeholder-gray-300"
                        placeholder="Type your question here...(Shift+Enter for new line)"
                    ></textarea>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            disabled={isProcessing || !question.trim()} 
                            type="submit" 
                            className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {isProcessing ? 'Sending...' : 'Send'}
                        </button>
                        <button 
                            disabled={isProcessing} 
                            type="button" 
                            onClick={() => navigate('/chat-bot-history')}
                            className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {isProcessing ? 'Sending...' : 'See History'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}