import { useNavigate, useParams } from "react-router-dom";
import type { Note } from "../services/custom-types";
import { useSupabaseTable } from "../services/useSupabaseTable";
import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import BalanceNotification from "../components/BalanceNotification";

export default function NoteDetail() {
    const navigate = useNavigate();
    const noteTable = 'notes';
    const { id } = useParams();

    const { realtimeInit, initTableData, updateData } = useSupabaseTable<Note>();
    const { error, isLoading } = initTableData({
        tableName: noteTable,
        additionalQuery: (addQuery) => addQuery.eq('id', id),
        uniqueQueryKey: id ? [id] : ['no-data']
    });
    const updateMutation = updateData();

    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            realtimeInit({
                tableName: noteTable,
                uniqueQueryKey: [id],
                additionalQuery: (query) => query.eq('id', id),
                callback: (data) => {
                    if (data && data.length > 0) {
                        setTitle(data[0].note_title);
                        setContent(data[0].note_content);
                    }
                }
            });
        }
    }, [id, realtimeInit]);

    async function handleUpdateNote(event: React.FormEvent): Promise<void> {
        event.preventDefault();

        try {
            if (!id) return;

            await updateMutation.mutateAsync({
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
        }
    }

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showMessage]);

    if (!id) {
        return <div className="p-[1rem] text-center text-red-500">Note Not Found</div>;
    }

    if (error) {
        const errorMessage = error.name === "TypeError" && error.message === "Failed to fetch" 
            ? "Check your internet connection" 
            : error.message;
        return <div className="p-[1rem] text-center text-red-500">{errorMessage}</div>;
    }

    if (isLoading) {
        return <div className="p-[1rem] text-center">Loading note details...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row p-[1rem] gap-[1rem] h-screen">
            <Navbar1/>
            <Navbar2/>
            <form onSubmit={handleUpdateNote} className="md:w-[75%] w-full p-[1rem] border border-black rounded-lg flex flex-col gap-[1rem]">
                <input 
                    className="border border-black p-[0.45rem] text-[0.9rem] font-[550] outline-0"
                    type="text" 
                    value={title} 
                    placeholder="title"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                />
                <textarea 
                    className="resize-none md:h-screen h-[68.4vh] border border-black p-[0.5rem] text-[1rem] font-[550] outline-0"
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
                    value={content} 
                    placeholder="content"
                ></textarea>
                <button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.45rem] border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
            </form>
            {showMessage ?
                <BalanceNotification 
                    message={message}
                    onClose={() => setShowMessage(false)}
                    className="border border-black p-[0.5rem] text-[1rem] w-[280px]"
                />
            : null}
        </div>
    );
}