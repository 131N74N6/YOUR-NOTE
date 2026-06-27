import ReactMarkdown from "react-markdown";
import type { NoteItemProps } from "../models/note.model";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";
import { useMemo } from "react";

export default function NoteItem(props: NoteItemProps) {
    const sanitizedContent = useMemo(() => {
        if (!props.note.note_content) return '';
        
        return DOMPurify.sanitize(props.note.note_content, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [props.note._id, props.note.note_content]);

    return (
        <div className="flex flex-col gap-[0.45rem] p-[0.45rem] border border-white rounded-[0.45rem]">
            <div className="flex flex-col gap-2 md:h-[270px] h-[168px] overflow-hidden">
                <div className="font-bold text-white">{props.note.note_title}</div>
                <div className="text-white">{new Date(props.note.created_at).toLocaleString()}</div>
                <div className="line-clamp-4">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
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
                        {sanitizedContent}
                    </ReactMarkdown>
                </div>
            </div>
            <div className="flex gap-[0.4em]">
                <Link 
                    className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px] text-center" 
                    to={`/note-detail/${props.note._id}`}
                >
                    Select
                </Link>
                <button 
                    className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]" 
                    type="button" 
                    onClick={() => props.onDelete.mutate(props.note._id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}