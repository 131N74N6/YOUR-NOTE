import { Link, useNavigate } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { useState } from "react";
import useAuth from "../services/useAuth";
import type { INote } from "../services/custom-types";
import DataModifier from "../services/data-modifier";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NoteForm() {
    const { insertData } = DataModifier();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const insertNoteMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            const trimmedContent = content.trim();
            const trimmedTitle = title.trim();
            const getCurrentDate = new Date();

            if (!user) return;
            if (!trimmedContent || !trimmedTitle) throw new Error('Missing required data');

            await insertData<INote>({
                api_url: 'http://localhost:1234/notes/add',
                api_data: {
                    created_at: getCurrentDate.toISOString(),
                    note_content: trimmedContent,
                    note_title: trimmedTitle,
                    user_id: user.info.id
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`notes-${user?.info.id}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${user?.info.id}`] });
            navigate('/notes');
        },
        onSettled: () => {
            resetForm();
            setIsDataChanging(false);
        }
    });

    const addNote = (event: React.FormEvent): void => {
        event.preventDefault();
        insertNoteMutation.mutate();
    }

    const resetForm = () => {
        setTitle('');
        setContent('');
    }

    return (
        <div className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            <form onSubmit={addNote} className="flex flex-col h-full gap-[1rem] p-[1rem] md:w-3/4 w-full border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">                
                <input 
                    type="text" 
                    placeholder="ex: my favorite music" 
                    value={title}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                    className="p-[0.45rem] text-[0.9rem] border border-white outline-0 text-white font-[500] rounded-[0.5rem]"
                />
                <textarea 
                    value={content}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
                    className="resize-0 border h-full outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem]"
                ></textarea>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-[0.7rem]">
                    <Link className="bg-white text-center cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" to={"/notes"}>Back</Link>
                    <button 
                        type="submit" 
                        disabled={!title || !content || isDataChanging}
                        className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}