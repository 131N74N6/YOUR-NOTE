import { Navbar1, Navbar2 } from "../components/Navbar";
import NoteList from "../components/NoteList";
import Loading from "../components/Loading";
import { useEffect } from "react";
import Notification from "../components/Notification";
import NoteServices from "../services/note.service";

export default function Notes() {
    const { deleteOneNoteMutation, deleteManyNotesMutation, isProcessing, message, navigate, notes, setMessage } = NoteServices();

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
                        disabled={isProcessing || notes.isLoading}
                        onClick={() => navigate('/add-note')}
                        className="bg-white cursor-pointer font-[500] disabled:cursor-not-allowed text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Add Note
                    </button>
                    <button 
                        type="button" 
                        disabled={isProcessing || notes.isLoading}
                        onClick={() => deleteManyNotesMutation.mutate()}
                        className="bg-white cursor-pointer font-[500] disabled:cursor-not-allowed text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Delete All Notes
                    </button>
                </div>
                {notes.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : notes.error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-white font-[600] text-[1rem]">{notes.error.message || 'Failed to load your notes. Try again later.'}</p>
                    </div>
                ) : (
                    <NoteList 
                        notes={notes.paginatedData} 
                        getMore={notes.fetchNextPage}
                        isLoadMore={notes.isFetchingNextPage}
                        isReachedEnd={notes.isReachedEnd}
                        onDelete={deleteOneNoteMutation}
                    />
                )}
            </div>
        </main>
    );
}