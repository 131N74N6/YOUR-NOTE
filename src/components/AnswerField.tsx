import { memo, useCallback, useState } from "react";

type BotAnswer = {
    answer: string;
    clearResult: () => void;
    error: string;
    loading: boolean;
}

const AnswerField = memo((props: BotAnswer) => {
    const [copyAnswer, setCopyAnswer] = useState<boolean>(false);

    const copyToClipboard = useCallback(async (): Promise<void> => {
        await navigator.clipboard.writeText(props.answer);
        setCopyAnswer(true);
        setTimeout(() => setCopyAnswer(false), 2000);
    }, [props.answer]);

    return (
        <div className="resize-0 border h-3/4 outline-0 border-white p-[0.7rem] gap-[0.7rem] flex flex-col text-white font-[500] rounded-[0.5rem]">
            <div className="flex justify-between">
                <button type="button" onClick={copyToClipboard} className="cursor-pointer">
                    {copyAnswer ? 
                        <i className="fa-solid fa-check text-white"></i> : 
                        <i className="fa-solid fa-clipboard text-white"></i>
                    }
                </button>
                <button type="button" onClick={props.clearResult} className="cursor-pointer">
                    <i className="fa-solid fa-trash text-white"></i>
                </button>
            </div>
            <div>
                <div className="whitespace-pre-wrap">
                    {props.loading ? 'Thinking...' : props.error ? props.error : props.answer}
                </div>
            </div>
        </div>
    );
});

export default AnswerField;