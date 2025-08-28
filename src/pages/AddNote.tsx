import { useState } from "react";
import type { Note } from "../services/custom-types";
import { useSupabaseTable } from "../services/useSupabaseTable";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../services/useAuth";

export default function AddNote() {
    const navigate = useNavigate();
    const noteTable = 'notes';
    const { user } = useAuth();
    const { insertData } = useSupabaseTable<Note>({ tableName: noteTable });

    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    async function handleAddNote(event: React.FormEvent): Promise<void> {
        event.preventDefault();

        if (!user?.id) return;

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        await insertData({
            tableName: noteTable,
            newData: {
                note_content: trimmedContent,
                note_title: trimmedTitle,
                user_id: user?.id
            }
        });

        setTitle('');
        setContent('');

        navigate('/home', { replace: true });
    }

    return (
        <div className="flex flex-col md:flex-row p-[1rem] gap-[1rem] h-screen">
            <Navbar class_name={"w-full md:w-1/4 lg:w-1/4 flex-shrink-0 flex flex-col gap-[1rem] p-[1rem] border border-black rounded-lg"}/>
            <form onSubmit={handleAddNote} className="md:w-[75%] w-[100%] p-[1rem] border border-black rounded-lg flex flex-col gap-[1rem]">
                <input 
                    className="border border-black p-[0.45rem] text-[0.9rem] font-[550] outline-0"
                    type="text" placeholder="title"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                />
                <textarea 
                    className="resize-none h-[600px] border border-black p-[0.5rem] text-[1rem] font-[550] outline-0"
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
                    placeholder="content"
                ></textarea>
                <button 
                    type="button" 
                    className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.45rem] border-0"
                >
                    Save
                </button>
            </form>
        </div>
    );
}