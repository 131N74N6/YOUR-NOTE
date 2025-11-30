import { Link } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import NoteList from "../components/NoteList";
import useAuth from "../services/useAuth";
import Loading from "../components/Loading";
import type { INote } from "../services/custom-types";
import DataModifier from "../services/data-modifier";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Notes() {
    const { user } = useAuth();
    const { deleteData, infiniteScroll } = DataModifier();
    const queryClient = useQueryClient();

    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const { 
        paginatedData: noteData, 
        fetchNextPage,
        isFetchingNextPage,
        isReachedEnd,
        isLoading 
    } = infiniteScroll<INote>({
        api_url: user ? `http://localhost:1234/notes/get-all/${user.info.id}` : '',
        query_key: [`notes-${user?.info.id}`],
        stale_time: 600000,
        limit: 12
    });

    const deleteOneNoteMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `http://localhost:1234/notes/erase/${id}` })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`notes-${user?.info.id}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${user?.info.id}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const deleteManyNotesMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            if (!user) return;
            await deleteData({ api_url: `http://localhost:1234/notes/erase-all/${user.info.id}` });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`notes-${user?.info.id}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${user?.info.id}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const deleteAllNotes = () => {
        deleteManyNotesMutation.mutate();
    }

    const deleteSelectedNote = async (id: string) => {
        deleteOneNoteMutation.mutate(id);
    }
    
    if (isLoading) return <Loading/>

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full min-h-[500px] p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="flex gap-[0.7rem]">
                    <Link to={'/add-note'} className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]">Add Note</Link>
                    <button 
                        type="button" 
                        disabled={isDataChanging}
                        onClick={deleteAllNotes}
                        className="bg-white cursor-pointer font-[500] disabled:cursor-not-allowed text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Delete All Notes
                    </button>
                </div>
                <NoteList 
                    notes={noteData ? noteData : []} 
                    getMore={fetchNextPage}
                    isLoadMore={isFetchingNextPage}
                    isReachedEnd={isReachedEnd}
                    onDelete={deleteSelectedNote}
                />
            </div>
        </main>
    );
}