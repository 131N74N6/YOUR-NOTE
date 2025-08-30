import { useState } from "react";
import { Navbar1 } from "../components/Navbar";
import NoteList from "../components/NoteList";
import Notification from "../components/Notification";
import type { Note } from "../services/custom-types";
import { useAuth } from "../services/useAuth";
import { useSupabaseTable } from "../services/useSupabaseTable";

export default function Notes() {
    const noteTable = 'notes';
    const { user } = useAuth();
    const { data, error, deleteData } = useSupabaseTable<Note>({ 
        tableName: noteTable, 
        uniqueQueryKey: user?.id ? [user.id] : ['no-user'],
        filterKey: user?.id ? `user_id=eq.${user.id}` : undefined,
        additionalQuery: (addQuery) => addQuery.eq('user_id', user?.id)
    });

    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    if (!user?.id) return <div className="p-[1rem] text-center text-red-500">User Not Found</div>;

    async function deleteSelectedNote(noteId: string) {
        try {
            if (data.length > 0) {
                await deleteData({ 
                    tableName: noteTable, 
                    column: 'id', 
                    values: noteId 
                });
            } else {
                throw new Error('Empty!');
            }
        } catch (error: any) {
            setShowMessage(true);
            setMessage(error.message);
        } finally {
            setTimeout(() => setShowMessage(false), 3000);
        }
    }

    async function deleteAllNotes(): Promise<void> {
        try {
            if (data.length > 0) {
                await deleteData({
                    tableName: noteTable,
                    column: 'user_id',
                    values: user?.id
                });
            } else {
                throw new Error('Empty!');
            }
        } catch (error: any) {
            setShowMessage(true);
            setMessage(error.message);
        } finally {
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
        <div className="flex flex-col md:flex-row p-[1rem] gap-[1rem] h-screen relative z-10">
            <Navbar1/>
            <div className="flex flex-col gap-[1rem] max-sm:pb-[1rem]">
                <div className="flex gap-[0.5rem] p-[1rem] border border-black rounded-lg">
                    <button 
                        type="button" 
                        className="bg-black border-0 rounded-[0.4rem] flex items-center gap-[0.4rem] text-white cursor-pointer text-[0.9rem] p-[0.4rem] font-[550]" 
                        onClick={deleteAllNotes}
                    >
                        <i className="fa-solid fa-trash-can"></i>
                        <span>Delete All</span>
                    </button>
                </div>
                <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] p-[1rem] border border-black rounded-lg overflow-auto">
                    {data.length > 0 ? data.map((note) => (
                        <NoteList 
                            key={`note_${note.id}`}
                            id={note.id} 
                            created_at={note.created_at} 
                            user_id={note.user_id}
                            note_content={note.note_content} 
                            note_title={note.note_title} 
                            onDelete={deleteSelectedNote} 
                            onView={`/note-detail/${note.id}`}
                        />
                    ))
                    : <div className="flex justify-center items-center h-screen">
                        <span className="text-red-600 font-[600] text-[1.3rem]">'No notes added currently...'</span>
                    </div>}
                </main>
            </div>
            {showMessage ?
                <div className="flex justify-center items-center inset-0 fixed z-20">
                    <Notification message={message} class_name="border border-black p-[0.5rem] text-[1rem] w-[280px]"/>
                </div>
            : null}
        </div>
    );
}