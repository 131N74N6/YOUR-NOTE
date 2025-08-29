import { useState } from "react";
import Navbar from "../components/Navbar";

export default function AskAI() {
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    async function sendPrompt(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setLoading(true);
        const trimmedPrompt = prompt.trim();
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer <OPENROUTER_API_KEY>",
                "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
                "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat-v3.1:free",
                "messages": [
                    {
                        "role": "user",
                        "content": `${trimmedPrompt}`
                    }
                ]
            })
        });
    }

    return (
        <div className="flex md:flex-row flex-col p-[1rem] gap-[1rem] h-screen">
            <Navbar class_name={"w-full md:w-1/4 lg:w-1/4 flex-shrink-0 flex flex-col gap-[1rem] p-[1rem] border border-black rounded-lg"}/>
            <form onSubmit={sendPrompt} className="md:w-[75%] w-full p-[1rem] border border-black rounded-lg flex flex-col gap-[1rem]">
                <div>Result will appear here...</div>
                <textarea 
                    className="resize-none md:h-[600px] h-[200px] border border-black p-[0.5rem] text-[1rem] font-[550] outline-0"
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(event.target.value)}
                    placeholder="write here..."
                ></textarea>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.45rem] border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Please wait...' : <i className="fa-solid fa-paper-plane"></i>}
                </button>
            </form>
        </div>
    );
}