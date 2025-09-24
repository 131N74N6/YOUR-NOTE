import { useCallback, useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFirestore from "../services/useApiCalls";
import type { INote } from "../services/custom-types";
import Loading from "../components/Loading";

export default function SelectedNote() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getData, updateData } = useFirestore<INote>();

    const { data: selectedNote, isLoading } = getData<INote>({
        api_url: `http://localhost:1234/activities/selected/${id}`
    });

    const [editTitle, setEditTitle] = useState<string>('');
    const [editContent, setEditContent] = useState<string>('');
    console.log(id);

    useEffect(() => {
        if (selectedNote && selectedNote.length > 0) {
            const note = selectedNote[0];
            setEditContent(note.note_content || '');
            setEditTitle(note.note_title || '');
        } 
    }, [selectedNote, isLoading, id, navigate]);

    const saveEditedNote = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            if (!id) throw new Error('Note not found');

            const trimmedTitle = editTitle.trim();
            const trimmedContent = editContent.trim();
            
            await updateData({ 
                api_url: `http://localhost:1234/activities/change/${id}`,
                api_data: {
                    note_content: trimmedContent,
                    note_title: trimmedTitle,
                }
            });
        } catch (error: any) {
            console.error(error.message);
        } finally {
            navigate('/notes');
        }
    }, [editContent, editTitle, id]);

    if (isLoading) return <Loading/>

    return (
        <div className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            <form onSubmit={saveEditedNote} className="p-[1rem] md:w-3/4 w-full h-full flex flex-col gap-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <input 
                    type="text" 
                    placeholder="ex: my favorite music" 
                    value={editTitle}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditTitle(event.target.value)}
                    className="p-[0.45rem] text-[0.9rem] border border-white outline-0 text-white font-[500] rounded-[0.5rem]"
                />
                <textarea 
                    value={editContent}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(event.target.value)}
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