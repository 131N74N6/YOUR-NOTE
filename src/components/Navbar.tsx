import { Link } from "react-router-dom";
import useAuth from "../services/useAuth";

export function Navbar1() {
    const { quit, user } = useAuth();
    const signOut = async() => await quit();

    return (
        <nav className="md:w-1/4 md:flex border border-white shrink-0 hidden flex-col gap-[1.25rem] p-[1rem] backdrop-blur-sm backdrop-brightness-75 rounded-[1rem]">
            <Link to={'/activities'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-check-to-slot"></i>
                <span>ToDo</span>
            </Link>
            <Link to={'/balances'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-dollar-sign"></i>
                <span>Balances</span>
            </Link>
            <Link to={'/chat-bot'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-robot"></i>
                <span>Ask AI</span>
            </Link>
            <Link to={'/notes'} className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-note-sticky"></i>
                <span>Notes</span>
            </Link>
            <button type="button" className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white" onClick={signOut}>
                <i className="fa-solid fa-door-open"></i>
                <span>Sign Out</span>
            </button>
            <div className="flex-grow"></div>
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-user"></i>
                <span>{user?.displayName}</span>
            </div>
        </nav>
    );
}

export function Navbar2() {
    const { quit, user } = useAuth();
    const signOut = async() => await quit();

    return (
        <nav className="md:hidden w-full flex shrink-0">
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-user"></i>
                <span>{user?.displayName}</span>
            </div>
            <button type="button" className="cursor-pointer text-left" onClick={signOut}>
                <i className="fa-solid fa-door-open"></i>
                <span>Sign Out</span>
            </button>
        </nav>
    );
}