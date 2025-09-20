import { useCallback, useState, useEffect } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import AnswerField from "../components/AnswerField";

type OpenRouterMessage = {
    role: string;
    content: string;
    refusal?: string;
    reasoning?: string;
}

type OpenRouterChoice = {
    message: OpenRouterMessage;
}

type OpenRouterResponse = {
    choices: OpenRouterChoice[];
}

export default function ChatBot() {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const sendQuestion = useCallback(async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const trimmedQuestion = question.trim();

        if (!trimmedQuestion) {
            setError('Question cannot be empty');
            return;
        }

        try {            
            setLoading(true);
            setError('');
            setAnswer('');

            const request = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
                    "HTTP-Referer": "<YOUR_SITE_URL>",
                    "X-Title": "<YOUR_SITE_NAME>",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-chat-v3.1:free",
                    "messages": [{ "role": "user", "content": trimmedQuestion }]
                })
            });

            if (!request.ok) {
                const errorData = await request.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP error! status: ${request.status}`);
            }

            const response: OpenRouterResponse = await request.json();
            
            // Extract content from the response
            if (response.choices && response.choices.length > 0) {
                const messageContent = response.choices[0].message.content;
                if (typeof messageContent === 'string') {
                    setAnswer(messageContent);
                } else {
                    throw new Error('Invalid response format from API');
                }
            } else {
                throw new Error('No response from AI');
            }
        } catch (error: any) {
            console.error('API Error:', error);
            setError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [question]);

    const clearResult = useCallback((): void => {
        setAnswer('');
        setError('');
        setQuestion('');
    }, []);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            setAnswer('');
            setError('');
            setQuestion('');
        };
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
                    className="resize-0 border h-1/4 outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem] bg-transparent placeholder-gray-300"
                    placeholder="Type your question here..."
                    disabled={loading}
                ></textarea>
                <div className="flex flex-col">
                    <button 
                        disabled={loading || !question.trim()} 
                        type="submit" 
                        className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </main>
    );
}