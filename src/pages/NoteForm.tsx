import { Link } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";

export default function NoteForm() {
    return (
        <div className="flex p-[1rem] md:flex-row h-screen flex-col gap-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full">
                <form className="p-[1rem] h-full flex flex-col gap-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                    <input 
                        type="text" 
                        placeholder="ex: my favorite music" 
                        className="p-[0.45rem] text-[0.9rem] border border-white outline-0 text-white font-[500] rounded-[0.5rem]"
                    />
                    <textarea className="resize-0 border h-full outline-0 border-white p-[0.7rem] text-white font-[500] rounded-[0.5rem]"></textarea>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-[0.7rem]">
                        <Link className="bg-white text-center cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" to={"/notes"}>Back</Link>
                        <button type="submit" className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}