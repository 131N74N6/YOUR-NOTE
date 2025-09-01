import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase-config";
import { useAuth } from "../services/useAuth";
import { useSupabaseTable } from "../services/useSupabaseTable";
import type { Users } from "../services/custom-types";

export default function SignIn() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const noteUserTable = 'note_user';
    const { user, signIn } = useAuth();
    const navigate = useNavigate();
    const { upsertData } = useSupabaseTable<Users>();
    const upsertMutation = upsertData();

    useEffect(() => {
        if (user) navigate('/notes', { replace: true });
    }, [user, navigate]);

    async function handleSignIn(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setLoading(true);

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail && !trimmedPassword) {
            setMessage('Please fill in all fields');
            setShowMessage(true);
            setLoading(false);
            return;
        }

        try {
            const { error } = await signIn(trimmedEmail, trimmedPassword);

            if (error) throw new Error('Failed to signin. Try again later');

            if (user) {
                const { data: profile, error: errorGetProfile } = await supabase
                .from(noteUserTable)
                .select('*')
                .eq('id', user.id)
                .single();

                if (errorGetProfile && errorGetProfile.code === 'PGRST116') throw errorGetProfile;

                if (!profile) {
                    const username = user.user_metadata?.username || 'New User';

                    await upsertMutation.mutateAsync({
                        tableName: noteUserTable,
                        dataToUpsert: {
                            id: user.id,
                            email: user.email,
                            password: trimmedPassword,
                            username: username
                        }
                    });
                }
            }
            navigate('/home', { replace: true });
        } catch (error: any) {
            setMessage(error.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        } finally {
            setEmail('');
            setPassword('');
            setLoading(false);
            setTimeout(() => setShowMessage(false), 3000);
        }
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
                    <div className="text-center">
                        <span>Don't have account?</span> 
                        <Link className="text-blue-600 hover:underline" to={'/signup'}>Sign Up</Link>
                    </div>
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
                        {loading ? 'Please wait...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}