import { Link } from "react-router-dom";

export default function SignUp() {
    return (
        <div className="relative z-10">
            <div className="flex justify-center items-center bg-[#f5faff] fixed inset-0 z-20 ">
                <form className="flex flex-col gap-[1.2rem] p-[1rem] border-[1px] w-[280px] border-[#000000] bg-[#FFFFFF]">
                    <h2 className="text-center font-[600] text-[1.2rem]">Welcome</h2>
                    <input type="text" placeholder="your_username" className="p-[0.45rem] text-[0.9rem] font-[550] outline-0 border-[1px] text-[#000000]"/>
                    <input type="email" placeholder="your@gmail.com" className="p-[0.45rem] text-[0.9rem] font-[550] outline-0 border-[1px] text-[#000000]"/>
                    <input type="password" placeholder="your_password" className="p-[0.45rem] text-[0.9rem] font-[550] outline-0 border-[1px] text-[#000000]"/>
                    <div className="text-center"><span>Already have account?</span> <Link to={'/'}>Sign Up</Link></div>
                    <button type="submit" className="bg-black text-[#FFFFFF] cursor-pointer text-[0.9rem] font-[550] p-[0.45rem]">Sign Up</button>
                </form>
            </div>
        </div>
    );
}