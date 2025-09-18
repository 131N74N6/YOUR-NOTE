import { useCallback, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";

export default function ChatBot() {
    const [question, setQuestion] = useState<string>('');

    const sendQuestion = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();

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

        const response = await request.json();
        console.log(response);
    }, [question]);
    
    return (
        <main className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <form onSubmit={sendQuestion} className="flex flex-col h-[100%] gap-[1rem] md:w-3/4 w-full overflow-y-auto p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="resize-0 border h-3/4 outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem]"></div>
                <textarea 
                    value={question}
                    title="user-question"
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(event.target.value)}
                    className="resize-0 border h-1/4 outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem]"
                ></textarea>
                <div className="flex flex-col">
                    <button type="submit" className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]">Send</button>
                </div>
            </form>
        </main>
    );
}