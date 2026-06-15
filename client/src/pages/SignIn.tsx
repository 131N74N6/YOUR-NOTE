import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../services/auth.service";

export default function SignIn() {
    const { currentUserId, error, isSigningIn, setError, signInMt } = useAuth();
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        if (currentUserId && !isSigningIn) navigate('/home', { replace: true });
    }, [currentUserId, isSigningIn, navigate]);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timeout);
        }
    }, [error, setError]);

    async function handleSignIn(event: React.FormEvent) {
        event.preventDefault();
        await signInMt.mutateAsync({ email: email.trim(), password: password });
    }

    return (
        <section className="flex justify-center items-center h-screen bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] p-3">
            <form onSubmit={handleSignIn} className="border border-white backdrop-brightness-50 backdrop-blur-sm p-[1rem] flex flex-col gap-[1rem] w-90">
                <div className="font-[650] text-[1.5rem] text-center text-white">Hello</div>
                
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="email" className="text-white font-[600]">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        className="w-full p-[0.45rem] text-[0.9rem] text-white outline-0 border border-white font-[600] rounded" 
                        placeholder="your@gmail.com"
                    />
                </div>
                
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="password" className="font-[600] text-white">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="password" 
                            value={password}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                            className="p-[0.45rem] w-full text-[0.9rem] text-white outline-0 border border-white font-[600] rounded pr-10" 
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

                <div className="text-center text-sm">
                    <span className="text-white">Don't have an account?</span> <Link className="text-blue-200 hover:underline" to={'/sign-up'}>Sign Up</Link>
                </div>
                
                {error ? (
                    <div className="text-amber-600 text-sm font-medium text-center p-2 bg-red-100 rounded">
                        {error}
                    </div>
                ) : null}
                
                <button 
                    type="submit" 
                    disabled={isSigningIn}
                    className="disabled:cursor-not-allowed p-[0.45rem] text-[0.9rem] outline-0 border-0 bg-black text-white font-[550] cursor-pointer rounded hover:bg-white hover:text-black transition-colors"
                >
                    {isSigningIn ? 'Please wait...' : 'Sign In'}
                </button>
            </form>
        </section>
    );
}