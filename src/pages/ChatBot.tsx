import { Navbar1, Navbar2 } from "../components/Navbar";

export default function ChatBot() {
    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="p-[1rem] border border-white md:w-3/4 w-full rounded-[1rem] backdrop-blur-sm backdrop-brightness-75"></div>
        </div>
    );
}