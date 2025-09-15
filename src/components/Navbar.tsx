import { Link } from "react-router-dom";

export function Navbar1() {
    return (
        <nav className="md:w-1/4 md:flex shrink-0 hidden flex-col gap-[1.25rem] p-[1rem]">
            <Link to={'/home'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
            </Link>
            <Link to={'/about'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-address-card"></i>
                <span>About</span>
            </Link>
            <Link to={'/add-post'} className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-square-plus"></i>
                <span>Add Post</span>
            </Link>
            <Link to={'/search-post'} className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Search Post</span>
            </Link>
            <button type="button" className="cursor-pointer text-left flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-door-open"></i>
                <span>Sign Out</span>
            </button>
            <div className="flex-grow"></div>
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-user"></i>
                <span>User</span>
            </div>
        </nav>
    );
}

export function Navbar2() {
    return (
        <nav className="md:hidden w-full flex shrink-0">
            <div className="flex items-center gap-[0.5rem] font-[550] text-[1.2rem]">
                <i className="fa-solid fa-user"></i>
                <span>User</span>
            </div>
            <button type="button" className="cursor-pointer text-left">
                <i className="fa-solid fa-door-open"></i>
                <span>Sign Out</span>
            </button>
        </nav>
    );
}