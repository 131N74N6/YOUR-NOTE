import { Link } from "react-router-dom";
import useAuth from "../services/auth.service";

export function Navbar1() {
    const { quit } = useAuth();

    return (
        <nav className="md:w-1/4 md:flex border border-white shrink-0 hidden flex-col gap-[1.25rem] p-[1rem] backdrop-blur-sm backdrop-brightness-75 rounded-[1rem]">
            <Link to={'/home'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-home"></i>
                <span>Home</span>
            </Link>
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
            <button type="button" className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white" onClick={quit}>
                <i className="fa-solid fa-door-open"></i>
                <span>Sign Out</span>
            </button>
            <div className="flex-grow"></div>
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-user"></i>
            </div>
        </nav>
    );
}

export function Navbar2() {
    const { quit } = useAuth();

    return (
        <nav className="md:hidden overflow-y-auto w-full flex gap-2.5 justify-center backdrop-blur-sm backdrop-brightness-75 p-[0.7rem] rounded-[0.7rem] border border-white">
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-user text-white"></i>
            </div>
            <Link to={'/home'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-home"></i>
            </Link>
            <Link to={'/activities'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-check-to-slot"></i>
            </Link>
            <Link to={'/balances'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-dollar-sign"></i>
            </Link>
            <Link to={'/chat-bot'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-robot"></i>
            </Link>
            <Link to={'/notes'} className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white">
                <i className="fa-solid fa-note-sticky"></i>
            </Link>
            <button type="button" className="cursor-pointer text-left" onClick={quit}>
                <i className="fa-solid fa-door-open text-white"></i>
            </button>
        </nav>
    );
}