import { Link } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { useCallback, useState } from "react";
import useAuth from "../services/useAuth";
import useApiCalls from "../services/useApiCalls";
import type { INote } from "../services/custom-types";

export default function NoteForm() {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const { user } = useAuth();
    const { insertData } = useApiCalls<INote>();

    const addNote = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedContent = content.trim();
        const trimmedTitle = title.trim();
        const getCurrentDate = new Date();

        if (!user) return;
        if (!trimmedContent || !trimmedTitle) throw new Error('Missing required data');

        await insertData({
            api_url: 'http://localhost:1234/balances/add',
            api_data: {
                created_at: getCurrentDate.toISOString(),
                note_content: trimmedContent,
                note_title: trimmedTitle,
                user_id: user.id
            }
        });

        resetForm();
    }, [title, content, user]);

    const resetForm = useCallback(() => {
        setTitle('');
        setContent('');
    }, []);

    return (
        <div className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            <form onSubmit={addNote} className="flex flex-col h-full gap-[1rem] p-[1rem] md:w-3/4 w-full border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">                
                <input 
                    type="text" 
                    placeholder="ex: my favorite music" 
                    value={title}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                    className="p-[0.45rem] text-[0.9rem] border border-white outline-0 text-white font-[500] rounded-[0.5rem]"
                />
                <textarea 
                    value={content}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
                    className="resize-0 border h-full outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem]"
                ></textarea>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-[0.7rem]">
                    <Link className="bg-white text-center cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" to={"/notes"}>Back</Link>
                    <button type="submit" className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]">Save</button>
                </div>
            </form>
        </div>
    );
}