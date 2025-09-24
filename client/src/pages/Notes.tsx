import { Link } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import NoteList from "../components/NoteList";
import useAuth from "../services/useAuth";
import useApiCalls from "../services/useModifyData";
import Loading from "../components/Loading";
import { useCallback } from "react";
import type { INote } from "../services/custom-types";
import useSWR, { useSWRConfig } from "swr";

export default function Notes() {
    const { user } = useAuth();
    const token = user?.token;

    const { deleteData } = useApiCalls<INote>();
    const { mutate } = useSWRConfig();

    const fetcher = async () => {
        if (!user) return;
        const request = await fetch(`http://localhost:1234/notes/get-all/${user.info.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();
        return response;
    }

    const { data: noteData, isLoading } = useSWR<INote[]>(`notes-${user?.info.id}`, fetcher);

    const deleteAllNotes = useCallback(async () => {
        if (!user) return;
        await deleteData({ api_url: `http://localhost:1234/notes/erase-all/${user.info.id}` });
        mutate(`notes-${user.info.id}`);
    }, [noteData, user]);

    const deleteSelectedNote = useCallback(async (id: string) => {
        if (!user) return;
        await deleteData({ api_url: `http://localhost:1234/notes/erase/${id}` });
        mutate(`notes-${user.info.id}`);
    }, []);
    
    if (isLoading) return <Loading/>

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full h-[90%] p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="flex gap-[0.7rem]">
                    <Link to={'/add-note'} className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]">Add Note</Link>
                    <button 
                        type="button" 
                        onClick={deleteAllNotes}
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Delete All Notes
                    </button>
                </div>
                <NoteList notes={noteData ? noteData : []} onDelete={deleteSelectedNote}/>
            </div>
        </main>
    );
}