import { useNavigate } from "react-router-dom";
import type { IUser } from "../models/user-model";
import { useEffect, useState } from "react";

export default function useAuth() {
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const currentUserId = currentUser ? currentUser.user_id : '';
    const currentUserToken = currentUser ? currentUser.token : '';

    useEffect(() => {
        const initAuth = () => {
            try {
                const userExist = localStorage.getItem('user');
                if (userExist) {
                    const parsedUser = JSON.parse(userExist);
                    setCurrentUser(parsedUser);
                }
            } catch (err) {
                localStorage.removeItem('user');
                setError('Failed to retrieve user data. Please sign in again.');
            } finally {
                setLoading(false); 
            }
        }

        initAuth();
    }, []);

    async function signIn(email: string, password: string) {
        setLoading(true);
        try {
            const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/sign-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const response: IUser = await request.json();

            if (!request.ok) {
                const errorMessage = response.message || 'Failed to sign in. Try again later';
                setError(errorMessage);
            } else {
                const signedInUser: IUser = { 
                    message: response.message,
                    token: response.token,
                    user_id: response.user_id
                }

                setCurrentUser(signedInUser);
                localStorage.setItem('user', JSON.stringify(signedInUser));
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function signUp(created_at: string, email: string, username: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/sign-up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ created_at, email, password, username }),
            });

            const response = await request.json();
            
            if (!request.ok) {
                setError(response.message || 'Failed to sign up. Try again later');
            } else {
                navigate('/sign-in');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function quit() {
        setCurrentUser(null);
        localStorage.removeItem('user');
        navigate('/sign-in');
    }

    return { currentUserId, currentUserToken, currentUser, error, loading, quit, setError, signIn, signUp }
}