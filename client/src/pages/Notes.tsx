import { useNavigate } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import NoteList from "../components/NoteList";
import useAuth from "../services/auth.services";
import Loading from "../components/Loading";
import type { INote } from "../models/note-model";
import DataModifier from "../services/data.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";

export default function Notes() {
    const { currentUserId } = useAuth();
    const { deleteData, infiniteScroll, message, setMessage } = DataModifier();
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const { 
        paginatedData: noteData, 
        error,
        fetchNextPage,
        isFetchingNextPage,
        isReachedEnd,
        isLoading 
    } = infiniteScroll<INote>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/get-all/${currentUserId}`,
        query_key: [`notes-${currentUserId}`],
        stale_time: 1800000,
        limit: 12
    });

    const deleteOneNoteMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/erase/${id}` })
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${currentUserId}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const deleteManyNotesMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            if (!currentUserId) return;
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/erase-all/${currentUserId}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${currentUserId}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            {message ? Notification(message) : null}
            <div className="flex flex-col gap-[1rem] md:w-3/4 h-full w-full min-h-[200px] p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="flex gap-[0.7rem]">
                    <button 
                        type="button" 
                        disabled={isDataChanging}
                        onClick={() => navigate('/add-note')}
                        className="bg-white cursor-pointer font-[500] disabled:cursor-not-allowed text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Add Note
                    </button>
                    <button 
                        type="button" 
                        disabled={isDataChanging}
                        onClick={() => deleteManyNotesMutation.mutate()}
                        className="bg-white cursor-pointer font-[500] disabled:cursor-not-allowed text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Delete All Notes
                    </button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-white font-[600] text-[1rem]">{error.message || 'Failed to load your notes. Try again later.'}</p>
                    </div>
                ) : (
                    <NoteList 
                        notes={noteData ? noteData : []} 
                        getMore={fetchNextPage}
                        isLoadMore={isFetchingNextPage}
                        isReachedEnd={isReachedEnd}
                        onDelete={deleteOneNoteMutation}
                    />
                )}
            </div>
        </main>
    );
}