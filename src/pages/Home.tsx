import Navbar from "../components/Navbar";
import NoteList from "../components/NoteList";
import type { Note } from "../services/custom-types";
import { useSupabaseTable } from "../services/useSupabaseTable";

export default function Home() {
    let currentUserId = '';
    const noteTable = 'notes';
    const { data, isLoading, error, deleteData } = useSupabaseTable<Note>({ 
        tableName: noteTable, 
        additionalQuery: (addQuery) => addQuery.eq('user_id', currentUserId)
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
            
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error.message}</div>
    }

    return (
        <>
            <div className="flex p-[1rem] gap-[1rem]">
                <Navbar/>
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-3">
                    {data.map(note => <NoteList 
                        id={note.id} created_at={note.created_at} user_id={note.user_id}
                        note_content={note.note_content} note_title={note.note_title} 
                        onDelete={() => deleteSelectedNote(note.id)} 
                        onView={`/detail-note/${note.id}`}
                    />)}
                </div>
            </div>
        </>
    );
}