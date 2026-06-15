import { useEffect } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import Notification from "../components/Notification";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ChatbotServices from "../services/chatbot.service";

export default function ChatBot() {
    const { answer, currentUserId, isProcessing, message, navigate, question, sanitizedAnswer, sendQuestion, setAnswer, setMessage, setQuestion } = ChatbotServices();

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
        <section className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1 is_processing={isProcessing}/>
            <Navbar2 is_processing={isProcessing}/>
            {message ? Notification(message) : null}
            <div className="flex flex-col h-full gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-50">
                <div className="h-[80%] overflow-y-auto">
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
        </section>
    );
}