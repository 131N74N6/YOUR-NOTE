import { useNavigate } from "react-router-dom";
import useAuth from "../services/auth.service";
import type { NavbarIntrf } from "../models/data.model";

export function Navbar1(props?: NavbarIntrf) {
    const navigate = useNavigate();
    const { quit } = useAuth();

    return (
        <nav className="md:w-1/4 md:flex border border-white shrink-0 hidden flex-col gap-[1.25rem] p-[1rem] backdrop-blur-sm backdrop-brightness-50 rounded-[1rem]">
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/home')} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed cursor-pointer">
                <i className="fa-solid fa-home"></i>
                <span>Home</span>
            </button>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/activities')} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed cursor-pointer">
                <i className="fa-solid fa-check-to-slot"></i>
                <span>ToDo</span>
            </button>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/balances')} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed cursor-pointer">
                <i className="fa-solid fa-dollar-sign"></i>
                <span>Balances</span>
            </button>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/chat-bot')} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed cursor-pointer">
                <i className="fa-solid fa-robot"></i>
                <span>Ask AI</span>
            </button>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/notes')} className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed">
                <i className="fa-solid fa-note-sticky"></i>
                <span>Notes</span>
            </button>
            <button type="button" disabled={props?.is_processing} className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white" onClick={quit}>
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

export function Navbar2(props?: NavbarIntrf) {
    const navigate = useNavigate();
    const { quit } = useAuth();

    return (
        <nav className="md:hidden overflow-y-auto w-full flex gap-2.5 justify-center backdrop-blur-sm backdrop-brightness-50 p-[0.7rem] rounded-[0.7rem] border border-white">
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-user text-white"></i>
            </div>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/home)')} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed cursor-pointer">
                <i className="fa-solid fa-home"></i>
            </button>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/activities')} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed cursor-pointer">
                <i className="fa-solid fa-check-to-slot"></i>
            </button>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/balances')} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed cursor-pointer">
                <i className="fa-solid fa-dollar-sign"></i>
            </button>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/chat-bot')} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed cursor-pointer">
                <i className="fa-solid fa-robot"></i>
            </button>
            <button type="button" disabled={props?.is_processing} onClick={() => navigate('/notes')} className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem] text-white disabled:cursor-not-allowed">
                <i className="fa-solid fa-note-sticky"></i>
            </button>
            <button type="button" disabled={props?.is_processing} className="cursor-pointer text-left" onClick={quit}>
                <i className="fa-solid fa-door-open text-white"></i>
            </button>
        </nav>
    );
}