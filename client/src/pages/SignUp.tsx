import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/useAuth";

export default function SignUp() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const navigate = useNavigate();
    const { signUp, user, error } = useAuth();

    useEffect(() => {
        if (user) navigate('/home', { replace: true });
    }, [user, navigate]);

    useEffect(() => {
        if (showMessage) {
            const timeout = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timeout);
        }
    }, [error, showMessage]);

    async function handleSignUp(event: React.FormEvent) {
        event.preventDefault();
        const getCurrentDate = new Date();
        if (error) setShowMessage(true);
        await signUp(getCurrentDate.toISOString(), email, username, password);
    }

    return (
        <div className="flex justify-center items-center h-screen bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <form onSubmit={handleSignUp} className="border border-white backdrop-brightness-75 backdrop-blur-sm p-[1rem] flex flex-col gap-[1rem] w-[320px]">
                <div className="font-[650] text-[1.5rem] text-white text-center">Welcome</div>
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="username" className="text-white">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                        className="p-[0.45rem] text-[0.9rem] outline-0 border border-white text-white font-[600]" 
                        placeholder="ex: john"
                    />
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="email" className="text-white">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        className="p-[0.45rem] text-[0.9rem] outline-0 border border-white text-white font-[600]" 
                        placeholder="your@gmail.com"
                    />
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="password" className="text-white">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        className="p-[0.45rem] text-[0.9rem] outline-0 border border-white text-white font-[600]" 
                        placeholder="your_password"
                    />
                </div>
                <div className="text-center text-white">Already have account? <Link className="text-blue-200 hover:underline" to={'/sign-in'}>Sign In</Link></div>
                {showMessage ? 
                    <div className="text-red-400 text-sm font-medium text-center p-2 bg-red-100 rounded">
                        {error}
                    </div>
                : null}
                <button 
                    type="submit" 
                    className="p-[0.45rem] text-[0.9rem] outline-0 border-0 bg-black text-white font-[550] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-white hover:text-black transition-colors"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}