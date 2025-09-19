import { useCallback, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import AnswerField from "../components/AnswerField";

export default function ChatBot() {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const sendQuestion = useCallback(async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const trimmedQuestion = question.trim();

        try {            
            setLoading(true);

            if (!trimmedQuestion) throw new Error('Question cannot be empty');

            const request = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
                    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
                    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-chat-v3.1:free",
                    "messages": [{ "role": "user", "content": `${question}` }]
                })
            });

            if (!request.ok) throw new Error('Failed to get answer');

            if (request.status === 500) throw new Error('Something went wrong!');

            const response = await request.json();
            setAnswer(response.choices[0].message);
            setError('');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
            setQuestion('');
        }
    }, [question]);

    const clearResult = useCallback((): void => {
        setQuestion('');
        setAnswer('');
        setError('');
    }, []);
    
    return (
        <main className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <form onSubmit={sendQuestion} className="flex flex-col h-[100%] gap-[1rem] md:w-3/4 w-full overflow-y-auto p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <AnswerField loading={loading} error={error} answer={answer} clearResult={clearResult}/>
                <textarea 
                    value={question}
                    title="user-question"
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(event.target.value)}
                    className="resize-0 border h-1/4 outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem]"
                ></textarea>
                <div className="flex flex-col">
                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </form>
        </main>
    );
}