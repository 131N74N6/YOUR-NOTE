import { Link } from "react-router-dom";
import { Navbar1, Navbar2 } from "../components/Navbar";

export default function Notes() {
    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full">
                <div className="p-[1rem] h-[90%] flex flex-col gap-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                    <div className="flex gap-[0.7rem]">
                        <Link to={'/add-note'} className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]">Add Note</Link>
                        <button type="button" className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]">Delete All Notes</button>
                    </div>
                    <div className="overflow-y-auto"></div>
                </div>
            </div>
        </div>
    );
}