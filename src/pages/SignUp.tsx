import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/useAuth";

export default function SignUp() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const { user, signUp } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/notes', { replace: true });
    }, [user, navigate]);

    async function handleSignUp(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setLoading(true);

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
            setMessage('Please fill in all fields');
            setShowMessage(true);
            setLoading(false);
            return;
        }

        try {
            const { error } = await signUp(trimmedEmail, trimmedPassword, trimmedUsername);

            if (error) throw new Error('Failed to signup. Try again later');

            setMessage('Sign up successful! Check your email for verification.');
            setShowMessage(true);
            
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error: any) {
            setMessage(error.message);
            setShowMessage(true);
        } finally {
            setLoading(false);
            setTimeout(() => setShowMessage(false));
        }
    }
    
    return (
        <div className="relative z-10">
            <div className="flex justify-center items-center bg-[#f5faff] fixed inset-0 z-20 ">
                <form 
                    onSubmit={handleSignUp} 
                    className="flex flex-col gap-[1.2rem] p-[1rem] border-[1px] w-[280px] border-[#000000] bg-[#FFFFFF]"
                >
                    <h2 className="text-center font-[600] text-[1.2rem]">Welcome</h2>
                    <input 
                        type="text" 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                        placeholder="your_username" 
                        className="p-[0.45rem] text-[0.9rem] font-[550] outline-0 border-[1px] text-[#000000]"
                    />
                    <input 
                        type="email" 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                        placeholder="your@gmail.com" 
                        className="p-[0.45rem] text-[0.9rem] font-[550] outline-0 border-[1px] text-[#000000]"
                    />
                    <input 
                        type="password" 
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        placeholder="your_password" 
                        className="p-[0.45rem] text-[0.9rem] font-[550] outline-0 border-[1px] text-[#000000]"
                    />
                    <div className="text-center"><span>Already have account?</span> <Link className="text-blue-600 hover:underline" to={'/signin'}>Sign In</Link></div>
                    {showMessage ? 
                        <div className="text-red-600 text-sm font-medium text-center">
                            {message}
                        </div>
                    : null}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="bg-black text-[#FFFFFF] cursor-pointer text-[0.9rem] font-[550] p-[0.45rem]"
                    >
                        {loading ? 'Please wait...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}