import { Link } from "react-router-dom";
import { useAuth } from "../services/useAuth";
import type { NavbarProps } from "../services/custom-types";

export default function Navbar(props: NavbarProps) {
    const { user, signOut } = useAuth();
    const handleSignOut = async () => await signOut();

    return (
        <nav className={props.class_name}>
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1rem]">
                <i className="fa-solid fa-user"></i>
                <span>{user?.user_metadata.username}</span>
            </div>
            <Link to={'/home'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                <i className="fa-solid fa-note-sticky"></i>
                <span>Notes</span>
            </Link>
            <Link to={'/add-note'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                <i className="fa-solid fa-circle-plus"></i>
                <span>Add Note</span>
            </Link>
            <Link to={'/todo'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                <i className="fa-solid fa-list"></i>
                <span>To-Do</span>
            </Link>
            <Link to={'/ask-ai'} className="flex items-center outline-0 gap-[0.5rem] font-[550] text-[1rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center">
                <i className="fa-solid fa-robot"></i>
                <span>Ask AI</span>
            </Link>
            <div className="flex-grow"></div> {/* Spacer to push the next element to the bottom */}
            <button 
                type="button" 
                onClick={handleSignOut} 
                className="flex items-center gap-[0.5rem] cursor-pointer hover:p-[0.5rem] hover:border hover:border-black rounded-md text-center"
            >
                <i className="fa-solid fa-door-open"></i>
                <span>Sign Out</span>
            </button>
        </nav>
    );
}