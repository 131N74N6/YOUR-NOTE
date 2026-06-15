import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/auth.service";

export default function SignUp() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const { currentUserId, error, isSigningIn, setError, signUp  } = useAuth();

    useEffect(() => {
        if (currentUserId && !isSigningIn) navigate('/home', { replace: true });
    }, [currentUserId, isSigningIn, navigate]);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timeout);
        }
    }, [error, setError]);

    async function handleSignUp (event: React.FormEvent) {
        event.preventDefault();
        await signUp(new Date().toISOString(), email.trim(), username.trim(), password);
    }

    return (
        <section className="flex justify-center items-center h-screen bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] p-3">
            <form onSubmit={handleSignUp} className="border border-white backdrop-brightness-50 backdrop-blur-sm p-[1rem] flex flex-col gap-[1rem] w-90">
                <div className="font-[650] text-[1.5rem] text-white text-center">Welcome</div>
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="username" className="text-white">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                        className="w-full p-[0.45rem] text-[0.9rem] outline-0 border border-white text-white font-[600]" 
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
                        className="w-full p-[0.45rem] text-[0.9rem] outline-0 border border-white text-white font-[600]" 
                        placeholder="your@gmail.com"
                    />
                </div>
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="password" className="text-white">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="password" 
                            value={password}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                            className="w-full p-[0.45rem] text-[0.9rem] outline-0 border border-white text-white font-[600]" 
                            placeholder="your_password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 px-3 flex cursor-pointer items-center text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-regular fa-eye"></i>}
                        </button>
                    </div>
                </div>
                <div className="text-center text-white">Already have account? <Link className="text-blue-200 hover:underline" to={'/sign-in'}>Sign In</Link></div>
                {error ? 
                    <div className="text-amber-600 text-sm font-medium text-center p-2 bg-red-100 rounded">
                        {error}
                    </div>
                : null}
                <button 
                    type="submit" 
                    disabled={isSigningIn}
                    className="p-[0.45rem] text-[0.9rem] outline-0 border-0 bg-black text-white font-[550] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-white hover:text-black transition-colors"
                >
                    {isSigningIn ? 'Please wait...' : 'Sign Up'}
                </button>
            </form>
        </section>
    );
}