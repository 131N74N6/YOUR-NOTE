import { useState } from "react";
import type { Note } from "../services/custom-types";
import { useSupabaseTable } from "../services/useSupabaseTable";
import { useNavigate } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { useAuth } from "../services/useAuth";
import Notification from "../components/Notification";

export default function AddNote() {
    const navigate = useNavigate();
    const noteTable = 'notes';
    const { user } = useAuth();
    
    const { insertData, initTableData } = useSupabaseTable<Note>();
    const insertMutation = insertData();
    const { error } = initTableData({ tableName: noteTable });

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    async function handleAddNote(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setLoading(true);

        try {
            if (!user?.id) return;

            const trimmedTitle = title.trim();
            const trimmedContent = content.trim();

            if (trimmedTitle === '' || trimmedContent === '') throw new Error('Please fill in all fields');

            await insertMutation.mutateAsync({
                tableName: noteTable,
                newData: {
                    note_content: trimmedContent,
                    note_title: trimmedTitle,
                    user_id: user.id
                }
            });
            navigate('/home', { replace: true });
        } catch (error: any) {
            setShowMessage(true);
            setMessage(error.message);
        } finally {
            setTitle('');
            setContent('');
            setLoading(false);
            setTimeout(() => setShowMessage(false), 3000);
        }
    }

    if (error) {
        const errorMessage = error.name === "TypeError" && error.message === "Failed to fetch" 
            ? "Check your internet connection" 
            : error.message;
        return <div className="p-[1rem] text-center text-red-500">{errorMessage}</div>;
    }

    return (
        <div className="flex flex-col relative z-10 md:flex-row p-[1rem] gap-[1rem] h-screen">
            <Navbar1/>
            <Navbar2/>
            <form onSubmit={handleAddNote} className="md:w-[75%] w-[100%] p-[1rem] border border-black rounded-lg flex flex-col gap-[1rem]">
                <input 
                    className="border border-black p-[0.45rem] text-[0.9rem] font-[550] outline-0"
                    type="text" placeholder="title" value={title}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                />
                <textarea 
                    className="resize-none md:h-[600px] h-[65vh] border border-black p-[0.5rem] text-[1rem] font-[550] outline-0"
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
                    placeholder="content" value={content}
                ></textarea>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.45rem] disabled:opacity-50 disabled:cursor-not-allowed border-0"
                >
                    {loading ? 'Please wait...' : 'Save'}
                </button>
            </form>
            {showMessage ?
                <div className="flex justify-center items-center inset-0 fixed">
                    <Notification message={message} class_name="border border-black p-[0.5rem] text-[1rem] w-[280px]"/>
                </div>
            : null}
        </div>
    );
}