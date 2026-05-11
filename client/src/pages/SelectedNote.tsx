import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { INote } from "../models/note-model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../services/auth-services";
import DataModifier from "../services/data-services";
import Notification from "../components/Notification";
import Loading from "../components/Loading";
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import List from 'quill/formats/list'; 
import Blockquote from 'quill/formats/blockquote';
import CodeBlock from 'quill/formats/code';

Quill.register('formats/list', List);
Quill.register('formats/blockquote', Blockquote);
Quill.register('formats/code-block', CodeBlock);

export default function SelectedNote() {
    const { currentUserId } = useAuth();
    const { _id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { getData, message, setMessage, updateData } = DataModifier();

    const [editTitle, setEditTitle] = useState<string>('');
    const [editContent, setEditContent] = useState<string>('');
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const { data: selectedNote, error, isLoading } = getData<INote[]>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/selected/${_id}`,
        query_key: [`selected-notes-${_id}`],
        stale_time: 1800000
    });

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

    const changeNoteMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            if (!_id) throw new Error('Note not found');

            await updateData<INote>({ 
                api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/change/${_id}`,
                api_data: {
                    note_content: editContent.trim(),
                    note_title: editTitle.trim(),
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`selected-notes-${_id}`] });
            queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                navigate('/notes');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        if (_id && selectedNote) {
            setEditContent(selectedNote?.[0].note_content || '');
            setEditTitle(selectedNote?.[0].note_title || '');
        }
    }, [selectedNote, _id, navigate]);

    const saveEditedNote = (event: React.FormEvent): void => {
        event.preventDefault();
        changeNoteMutation.mutate();
    }

    return (
        <main className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            {isLoading ? (
                <div className="flex justify-center items-center h-full"><Loading/></div>
            ) : error ? (
                <div className="flex justify-center items-center h-full">
                    <span className="text-white font-700 text-4xl">{error.message}</span>
                </div>
            ) : _id ? (
                <form onSubmit={saveEditedNote} className="p-[1rem] md:w-3/4 w-full h-full flex flex-col gap-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                    <input 
                        type="text" 
                        placeholder="ex: my favorite music" 
                        value={editTitle}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditTitle(event.target.value)}
                        className="p-[0.45rem] text-[0.9rem] border border-white outline-0 text-white font-[500] rounded-[0.5rem]"
                    />
                    <ReactQuill
                        theme="snow"
                        value={editContent}
                        onChange={setEditContent}
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
                            disabled={!editContent || !editTitle || isDataChanging}
                            className="bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]"
                        >
                            Save
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem]">
                    <span className="text-white font-[550] text-[1rem]">This Note has been deleted</span>
                </div>
            )}
            {message ? Notification(message) : null}
        </main>
    );
}