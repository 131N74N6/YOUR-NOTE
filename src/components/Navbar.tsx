import { Link } from "react-router-dom";
import { useAuth } from "../services/useAuth";
import { useState } from "react";

function Navbar1() {
    const { user, signOut } = useAuth();
    const handleSignOut = async () => await signOut();

    return (
        <nav className="w-full md:w-1/4 lg:w-1/4 flex-shrink-0 md:flex hidden flex-col gap-[1rem] p-[1rem] border border-black rounded-lg">
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1rem]">
                <i className="fa-solid fa-user"></i>
                <span>{user?.user_metadata.username}</span>
            </div>
            <Link to={'/notes'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                <i className="fa-solid fa-note-sticky"></i>
                <span>Notes</span>
            </Link>
            <Link to={'/todo'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                <i className="fa-solid fa-list"></i>
                <span>To-Do</span>
            </Link>
            <Link to={'/balance'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                <i className="fa-solid fa-dollar-sign"></i>
                <span>Balance</span>
            </Link>
            <Link to={'/ask-ai'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                <i className="fa-solid fa-robot"></i>
                <span>Ask AI</span>
            </Link>
            <div className="flex-grow"></div> {/* Spacer to push the next element to the bottom */}
            <button 
                type="button" 
                onClick={handleSignOut} 
                className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center"
            >
                <i className="fa-solid fa-door-open"></i>
                <span>Sign Out</span>
            </button>
        </nav>
    );
}

function Navbar2() {
    const { user, signOut } = useAuth();
    const handleSignOut = async () => await signOut();
    const [open, setOpen] = useState<boolean>(false);
    
    const openNavbar = () => setOpen(true);
    const closeNavbar = () => setOpen(false);

    return (
        <>
            <header className="md:hidden flex gap-[1rem] p-[1rem] border border-black">
                <div className="cursor-pointer" onClick={openNavbar}><i className="fa-solid fa-bars"></i></div>
                <div className="flex items-center gap-[0.5rem] font-[550] text-[1rem]">
                    <i className="fa-solid fa-user"></i>
                    <span>{user?.user_metadata.username}</span>
                </div>
            </header>
            {open ? 
                <nav className="border border-black p-[1rem] flex flex-col gap-[1rem]">
                    <div className="cursor-pointer" onClick={closeNavbar}><i className="fa-solid fa-xmark"></i></div>
                    <Link to={'/notes'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                        <i className="fa-solid fa-note-sticky"></i>
                        <span>Notes</span>
                    </Link>
                    <Link to={'/todo'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                        <i className="fa-solid fa-list"></i>
                        <span>To-Do</span>
                    </Link>
                    <Link to={'/balance'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                        <i className="fa-solid fa-dollar-sign"></i>
                        <span>Balance</span>
                    </Link>
                    <Link to={'/ask-ai'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                        <i className="fa-solid fa-robot"></i>
                        <span>Ask AI</span>
                    </Link>
                    <button 
                        type="button" 
                        onClick={handleSignOut} 
                        className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center"
                    >
                        <i className="fa-solid fa-door-open"></i>
                        <span>Sign Out</span>
                    </button>
                </nav>
            : null}
        </>
    );
}

export { Navbar1, Navbar2 }