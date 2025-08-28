import Navbar from "../components/Navbar";
import NoteList from "../components/NoteList";
import type { Note } from "../services/custom-types";
import { useAuth } from "../services/useAuth";
import { useSupabaseTable } from "../services/useSupabaseTable";

export default function Home() {
    const noteTable = 'notes';
    const { user } = useAuth();
    const { data, isLoading, error, deleteData } = useSupabaseTable<Note>({ 
        tableName: noteTable, 
        additionalQuery: (addQuery) => addQuery.eq('user_id', user?.id)
    });

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

    if (isLoading) {
        return <div className="p-[1rem] text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-[1rem] text-center text-red-500">{error.message}</div>;
    }

    return (
        <div className="flex flex-col md:flex-row p-[1rem] gap-[1rem] h-screen">
            <Navbar class_name={"w-full md:w-1/4 lg:w-1/4 flex-shrink-0 flex flex-col gap-[1rem] p-[1rem] border border-black rounded-lg"}/>
            <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[1rem] p-[1rem] border border-black rounded-lg overflow-auto">
                {data.map(note => (
                    <NoteList 
                        key={note.id}
                        id={note.id} 
                        created_at={note.created_at} 
                        user_id={note.user_id}
                        note_content={note.note_content} 
                        note_title={note.note_title} 
                        onDelete={() => deleteSelectedNote(note.id)} 
                        onView={`/note-detail/${note.id}`}
                    />
                ))}
            </main>
        </div>
    );
}