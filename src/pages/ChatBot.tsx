import { useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";

export default function ChatBot() {
    const [question, setQuestion] = useState<string>('');
    
    return (
        <div className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full">
                <form className="p-[1rem] h-full flex flex-col gap-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                    <div className="resize-0 border h-3/4 outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem]"></div>
                    <textarea 
                        value={question}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(event.target.value)}
                        className="resize-0 border h-1/4 outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem]"
                    ></textarea>
                    <div className="flex flex-col">
                        <button type="submit" className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]">Send</button>
                    </div>
                </form>
            </div>
        </div>
    );
}