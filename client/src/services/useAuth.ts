import type { User } from "./custom-types";
import { useEffect, useState } from "react";

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect((): void => {
        const userToken = localStorage.getItem('user');
        if (userToken) setUser(JSON.parse(userToken));
        setLoading(false);
    }, []);

    async function signUp(created_at: string, email: string, username: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const request = await fetch('http://localhost:1234/users/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ created_at, email, password, username }),
            });

            const response = await request.json();

            if (request.status === 409) throw new Error(response.message);

            return { response, error: null };
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function signIn(email: string, password: string) {
        setLoading(true);
        try {
            const request = await fetch('http://localhost:1234/users/sign-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const response = await request.json();

            if (request.status === 401) throw new Error(response.message);

            const signedInUser: User = { 
                id: response.id, 
                email, 
                username: response.username,
                token: response.token 
            };

            setUser(signedInUser);
            localStorage.setItem('user', JSON.stringify(signedInUser));
            
            return { response: signedInUser, error: null };
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function quit() {
        setUser(null);
        localStorage.removeItem('user');
    }

    return { error, loading, quit, signIn, signUp, user }
}