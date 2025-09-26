import { useNavigate } from "react-router-dom";
import type { IUser } from "./custom-types";
import { useEffect, useState } from "react";

export default function useAuth() {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect((): void => {
        const userToken = localStorage.getItem('user');
        if (userToken) setUser(JSON.parse(userToken));
        setLoading(false);
    }, []);

    async function signIn(email: string, password: string) {
        setLoading(true);
        try {
            const request = await fetch('http://localhost:1234/users/sign-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const response: IUser = await request.json();

            const signedInUser: IUser = { 
                message: response.message,
                token: response.token,
                info: {
                    id: response.info.id,
                    email: response.info.email,
                    username: response.info.username,
                }
            }

            setUser(signedInUser);
            localStorage.setItem('user', JSON.stringify(signedInUser));
            
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
            const request = await fetch('http://localhost:1234/users/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ created_at, email, password, username }),
            });

            if (request.ok) navigate('/sign-in');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function quit() {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/sign-in');
    }

    return { error, loading, quit, signIn, signUp, user }
}