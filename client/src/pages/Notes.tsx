import { Link } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import NoteList from "../components/NoteList";
import useAuth from "../services/useAuth";
import useFirestore from "../services/useApiCalls";
import Loading from "../components/Loading";
import { useCallback } from "react";
import type { INote } from "../services/custom-types";

export default function Notes() {
    const collectionName = 'notes';
    const { deleteData, realTimeInit } = useFirestore<INote>();
    const { user } = useAuth();
    const { data: noteData, loading } = realTimeInit({
        collection_name: collectionName,
        filters: user ? [['user_id', '==', user.uid]] : [],
        order_by_options: [['created_at', 'desc']]
    });

    const deleteAllNotes = useCallback(async () => {
        await deleteData({ collection_name: collectionName, filters: [['user_id', '==', user?.uid]] });
    }, [noteData, user]);

    const deleteSelectedNote = useCallback(async (id: string) => {
        await deleteData({ collection_name: collectionName, values: id });
    }, []);
    
    if (loading) return <Loading/>

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
                <div className="overflow-y-auto">
                    <NoteList notes={noteData} onDelete={deleteSelectedNote}/>
                </div>
            </div>
        </main>
    );
}