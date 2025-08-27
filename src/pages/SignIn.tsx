import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase-config";

export default function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    async function handleSignIn(event: SubmitEvent<>) {
        event.preventDefault();
        await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
    }
    
    return (
        <div className="relative z-10">
            <div className="flex justify-center items-center bg-[#f5faff] fixed inset-0 z-20 ">
                <form 
                    className="flex flex-col gap-[1.2rem] p-[1rem] border-[1px] w-[280px] border-[#000000] bg-[#FFFFFF]"
                    onSubmit={handleSignIn}
                >
                    <h2 className="text-center font-[600] text-[1.2rem]">Hello</h2>
                    <input 
                        type="email" 
                        placeholder="your@gmail.com" 
                        className="p-[0.45rem] text-[0.9rem] font-[550] outline-0 border-[1px] text-[#000000]"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="your_password" 
                        className="p-[0.45rem] text-[0.9rem] font-[550] outline-0 border-[1px] text-[#000000]"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    />
                    <div className="text-center"><span>Don't have account?</span> <Link to={'/signup'}>Sign Up</Link></div>
                    <button type="submit" className="bg-black text-[#FFFFFF] cursor-pointer text-[0.9rem] font-[550] p-[0.45rem]">Sign In</button>
                </form>
            </div>
        </div>
    );
}