import { useEffect } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import Notification from "../components/Notification";
import Loading from "../components/Loading";
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import List from 'quill/formats/list'; 
import Blockquote from 'quill/formats/blockquote';
import CodeBlock from 'quill/formats/code';
import NoteServices from "../services/note.service";

Quill.register('formats/list', List);
Quill.register('formats/blockquote', Blockquote);
Quill.register('formats/code-block', CodeBlock);

export default function SelectedNote() {
    const { _id } = useParams();
    const { changeNoteMutation, content, getSelectedNote, isProcessing, message, setContent, setMessage, setTitle, title } = NoteServices();

    const { data: selectedNote, error, isLoading } = getSelectedNote(_id!);

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

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        if (_id && selectedNote && selectedNote.length > 0) {
            setContent(selectedNote?.[0].note_content || '');
            setTitle(selectedNote?.[0].note_title || '');
        }
    }, [selectedNote, _id, content, title, setContent, setTitle]);

    const saveEditedNote = (event: React.FormEvent): void => {
        event.preventDefault();
        changeNoteMutation.mutate(_id!);
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
                            disabled={!content || !title || isProcessing}
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