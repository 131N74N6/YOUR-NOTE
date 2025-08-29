import { Navbar1 } from "../components/Navbar";
import NoteList from "../components/NoteList";
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

    if (!user?.id) return <div className="p-[1rem] text-center text-red-500">User Not Found</div>;

    async function deleteSelectedNote(noteId: string) {
        try {
            if (data.length > 0) {
                await deleteData({ 
                    tableName: noteTable, 
                    column: 'id', 
                    values: noteId 
                });
            } 
        } catch (error) {
            // Handle error appropriately, e.g., logging or showing a user message
            console.error('Failed to delete note:', error);
        }
    }

    async function deleteAllNotes(): Promise<void> {
        await deleteData({
            tableName: noteTable,
            column: 'user_id',
            values: user?.id
        });
    }

    if (error) {
        const errorMessage = error.name === "TypeError" && error.message === "Failed to fetch" 
            ? "Check your internet connection" 
            : error.message;
        return <div className="p-[1rem] text-center text-red-500">{errorMessage}</div>;
    }

    return (
        <div className="flex flex-col md:flex-row p-[1rem] gap-[1rem] h-screen">
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
                    {data.map((note) => (
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
                    ))}
                </main>
            </div>
        </div>
    );
}