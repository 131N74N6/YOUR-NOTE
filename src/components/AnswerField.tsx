import { memo, useCallback, useState, useEffect } from "react";

type BotAnswer = {
    answer: string;
    clearResult: () => void;
    error: string;
    loading: boolean;
}

const AnswerField = memo((props: BotAnswer) => {
    const [copyAnswer, setCopyAnswer] = useState<boolean>(false);
    const [copyTimeout, setCopyTimeout] = useState<NodeJS.Timeout | null>(null);

    const copyToClipboard = useCallback(async (): Promise<void> => {
        if (!props.answer) return;
        
        try {
            await navigator.clipboard.writeText(props.answer);
            setCopyAnswer(true);
            
            if (copyTimeout) clearTimeout(copyTimeout);
            
            const timeout = setTimeout(() => setCopyAnswer(false), 2000);
            setCopyTimeout(timeout);
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    }, [props.answer, copyTimeout]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (copyTimeout) {
                clearTimeout(copyTimeout);
            }
        };
    }, [copyTimeout]);

    return (
        <div className="resize-0 border h-3/4 outline-0 border-white p-[0.7rem] gap-[0.7rem] flex flex-col text-white font-[500] rounded-[0.5rem] bg-transparent">
            <div className="flex justify-between">
                <button 
                    type="button" 
                    onClick={copyToClipboard} 
                    className="cursor-pointer disabled:opacity-50"
                    disabled={!props.answer}
                    aria-label="Copy to clipboard"
                >
                    {copyAnswer ? 
                        <i className="fa-solid fa-check text-green-400"></i> : 
                        <i className="fa-solid fa-clipboard text-white"></i>
                    }
                </button>
                <button 
                    type="button" 
                    onClick={props.clearResult} 
                    className="cursor-pointer"
                    aria-label="Clear result"
                >
                    <i className="fa-solid fa-trash text-white"></i>
                </button>
            </div>
            <div className="overflow-auto flex-1">
                {props.loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse text-gray-300">Thinking...</div>
                    </div>
                ) : props.error ? (
                    <div className="text-red-300 whitespace-pre-wrap">{props.error}</div>
                ) : (
                    <div className="whitespace-pre-wrap">{props.answer}</div>
                )}
            </div>
        </div>
    );
});

export default AnswerField;