import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/useAuth";

export default function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { user, signIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/home', { replace: true });
    }, [user, navigate]);

    async function handleSignIn(event: React.FormEvent) {
        event.preventDefault();
        await signIn(email, password);
    }

    return (
        <div className="flex justify-center items-center h-screen bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <form onClick={handleSignIn} className="border border-white backdrop-brightness-75 backdrop-blur-sm p-[1rem] flex flex-col gap-[1rem] w-[320px]">
                <div className="font-[650] text-[1.5rem] text-center text-white">Hello</div>
                
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="email" className="text-white font-[600]">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        className="p-[0.45rem] text-[0.9rem] text-white outline-0 border border-white font-[600] rounded" 
                        placeholder="your@gmail.com"
                        required
                    />
                </div>
                
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="password" className="font-[600] text-white">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        className="p-[0.45rem] text-[0.9rem] text-white outline-0 border border-white font-[600] rounded" 
                        placeholder="your_password"
                        required
                    />
                </div>
                
                <div className="text-center text-sm">
                    <span className="text-white">Don't have an account?</span> <Link className="text-blue-200 hover:underline" to={'/sign-up'}>Sign Up</Link>
                </div>
                
                {/* {showMessage && (
                    <div className="text-amber-600 text-sm font-medium text-center p-2 bg-red-100 rounded">
                        {message}
                    </div>
                )} */}
                
                <button 
                    type="submit" 
                    className="p-[0.45rem] text-[0.9rem] outline-0 border-0 bg-black text-white font-[550] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-white hover:text-black transition-colors"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}