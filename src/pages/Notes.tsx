import { useCallback, useState, useEffect } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import NoteList from "../components/NoteList";
import Notification from "../components/Notification";
import type { Note } from "../services/custom-types";
import { useAuth } from "../services/useAuth";
import { useSupabaseTable } from "../services/useSupabaseTable";
import { Link } from "react-router-dom";

export default function Notes() {
    const noteTable = 'notes';
    const { user } = useAuth();
    const { realtimeInit, initTableData, deleteData } = useSupabaseTable<Note>();
    
    // Get the table data using React Query
    const { data = [], isLoading, error } = initTableData({
        tableName: noteTable,
        uniqueQueryKey: user?.id ? [user.id] : ['no-user'],
        additionalQuery: (addQuery) => user?.id ? addQuery.eq('user_id', user.id) : addQuery
    });

    // Initialize realtime connection
    useEffect(() => {
        if (user?.id) {
            realtimeInit({
                tableName: noteTable,
                uniqueQueryKey: [user.id],
                additionalQuery: (query) => query.eq('user_id', user.id),
            });
        }

        // Cleanup on unmount
        return () => {
            // Note: The teardown is handled internally by useSupabaseTable
        };
    }, [user?.id, realtimeInit]);

    // Get the delete mutation
    const deleteMutation = deleteData();

    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const deleteSelectedNote = useCallback(async (noteId: string) => {
        try {
            await deleteMutation.mutateAsync({ 
                tableName: noteTable, 
                column: 'id', 
                values: noteId 
            });
        } catch (error: any) {
            setShowMessage(true);
            setMessage(error.message);
            setTimeout(() => setShowMessage(false), 3000);
        } 
    }, [deleteMutation]);

    const deleteAllNotes = useCallback(async (): Promise<void> => {
        try {
            if (!user?.id) throw new Error('User not found!');

            await deleteMutation.mutateAsync({
                tableName: noteTable,
                column: 'user_id',
                values: user.id
            });
        } catch (error: any) {
            setShowMessage(true);
            setMessage(error.message);
            setTimeout(() => setShowMessage(false), 3000);
        }
    }, [deleteMutation, user?.id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
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
            <Navbar2/>
            <div className="flex flex-col gap-[1rem] max-sm:pb-[1rem]">
                <div className="flex gap-[0.5rem] p-[1rem] border border-black rounded-lg">
                    <button 
                        type="button" 
                        className="bg-black border-0 rounded-[0.4rem] flex items-center gap-[0.4rem] text-white cursor-pointer text-[0.9rem] p-[0.4rem] font-[550]" 
                        onClick={deleteAllNotes}
                        disabled={deleteMutation.isPending}
                    >
                        <i className="fa-solid fa-trash-can"></i>
                        <span>
                            {deleteMutation.isPending ? "Deleting..." : "Delete All"}
                        </span>
                    </button>
                    <Link to={'/add-note'} className="bg-black border-0 rounded-[0.4rem] flex items-center gap-[0.4rem] text-white cursor-pointer text-[0.9rem] p-[0.4rem] font-[550]">
                        <i className="fa-solid fa-circle-plus"></i>
                        <span>Add Note</span>
                    </Link>
                </div>
                <main className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] p-[1rem] border border-black rounded-lg overflow-auto">
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
                    : <div className="flex justify-center items-center">
                        <span className="text-red-600 font-[600] text-[1.3rem]">No notes added currently...</span>
                    </div>}
                </main>
            </div>
            {showMessage &&
                <div className="flex justify-center items-center inset-0 fixed z-20">
                    <Notification message={message} class_name="border bg-white border-black p-[0.5rem] text-[1rem] w-[280px]"/>
                </div>
            }
        </div>
    );
}