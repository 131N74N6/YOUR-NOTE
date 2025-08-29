import { useNavigate, useParams } from "react-router-dom";
import type { Note } from "../services/custom-types";
import { useSupabaseTable } from "../services/useSupabaseTable";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";

export default function NoteDetail() {
    const navigate = useNavigate();
    const noteTable = 'notes';
    const { id } = useParams();

    if (!id) {
        return <div className="p-[1rem] text-center text-red-500">Note Not Found</div>;
    }

    const { data, error, updateData } = useSupabaseTable<Note>({ 
        tableName: noteTable,
        uniqueQueryKey: [id],
        additionalQuery: (addQuery) => addQuery.eq('id', id),
    });

    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    useEffect(() => {
        setTitle(data[0].note_title || '');
        setContent(data[0].note_content || '');
    }, [data]);

    async function handleUpdateNote(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setLoading(true);

        try {
            if (!id) return;

            await updateData({
                tableName: noteTable,
                newData: {
                    note_content: content,
                    note_title: title
                },
                column: 'id',
                values: id
            });
            navigate('/home', { replace: true });
        } catch (error: any) {
            setMessage(error.message);
            setShowMessage(true);
        } finally {
            setTitle('');
            setContent('');
            setLoading(false);
            setTimeout(() => setShowMessage(false), 3000);
        }
    }

    if (error) {
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
            error.message = "Check your internet connection";
        }
        return <div className="p-[1rem] text-center text-red-500">{error.message}</div>;
    }

    return (
        <div className="flex flex-col md:flex-row p-[1rem] gap-[1rem] h-screen">
            <Navbar class_name={"w-full md:w-1/4 lg:w-1/4 flex-shrink-0 flex flex-col gap-[1rem] p-[1rem] border border-black rounded-lg"}/>
            <form onSubmit={handleUpdateNote} className="md:w-[75%] w-full p-[1rem] border border-black rounded-lg flex flex-col gap-[1rem]">
                <input 
                    className="border border-black p-[0.45rem] text-[0.9rem] font-[550] outline-0"
                    type="text" value={title} placeholder="title"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                />
                <textarea 
                    className="resize-none h-[600px] border border-black p-[0.5rem] text-[1rem] font-[550] outline-0"
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
                    value={content} placeholder="content"
                ></textarea>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.45rem] border-0 disabled:opacity-50 disabled:cursor-not-allowed"
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