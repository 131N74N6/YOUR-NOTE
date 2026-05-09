import { Link, useNavigate } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { useEffect, useState } from "react";
import useAuth from "../services/auth-services";
import Notification from "../components/Notification";
import type { INote } from "../services/custom-types";
import DataModifier from "../services/data-services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import List from 'quill/formats/list'; 
import Blockquote from 'quill/formats/blockquote';
import CodeBlock from 'quill/formats/code';

Quill.register('formats/list', List);
Quill.register('formats/blockquote', Blockquote);
Quill.register('formats/code-block', CodeBlock);

export default function NoteForm() {
    const { insertData, message, setMessage } = DataModifier();
    const { currentUserId } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'blockquote', 'code-block',
        'list', 
        'indent',
        'script', 'direction',
        'size', 'color', 'background',
        'font', 'align',
        'link', 'image', 'video'
    ];

    const insertNoteMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            await insertData<INote>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/add`,
                api_data: {
                    created_at: new Date().toISOString(),
                    note_content: content.trim(),
                    note_title: title.trim(),
                    user_id: currentUserId
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${currentUserId}`] });
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

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                navigate('/notes');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect((): void => {
        if (!currentUserId) {
            resetForm();
            setMessage(null);
        }
    }, [currentUserId, resetForm]);

    return (
        <div className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            {message ? Notification(message) : null}
            <form onSubmit={addNote} className="flex flex-col h-full gap-[1rem] p-[1rem] md:w-3/4 w-full border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">                
                <input 
                    type="text" 
                    placeholder="ex: my favorite music" 
                    value={title}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                    className="p-[0.45rem] text-[0.9rem] border border-white outline-0 text-white font-[500] rounded-[0.5rem]"
                />
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    className="overflow-y-auto bg-transparent text-white"
                    placeholder="Write your note here..."
                    style={{
                        height: '100%',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        color: 'white',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '0.5rem'
                    }}
                />
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