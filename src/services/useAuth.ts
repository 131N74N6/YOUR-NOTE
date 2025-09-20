import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import type { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { db, emailAuth } from "./firebase-config";
import { doc, setDoc } from "firebase/firestore";

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect((): () => void => {
        setLoading(true);
        const unSubscribe = onAuthStateChanged(emailAuth, (user) => {
            setUser(user);
            setLoading(false);
            setError(null);
        }, (error) => {
            setError(error.message);
            setLoading(false);
        });

        return () => unSubscribe();
    }, []);

    const signUp = useCallback(async (email: string, username: string, password: string) => {
        setLoading(true);
        try {
            if (!email.trim() || !username.trim() || !password.trim()) throw new Error('Missing required data');
            if (!email.trim()) throw new Error('email is required!');
            if (!username.trim()) throw new Error('username is required!');
            if (password.trim().length < 6) throw new Error('password is too weak');

            const userCredential = await createUserWithEmailAndPassword(emailAuth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: username });
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                username: username,
                created_at: new Date()
            });

            return { data: user, error: null }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            if (!email.trim() || !password.trim()) throw new Error('Missing required data');
            if (!email.trim()) throw new Error('email is required!');
            if (password.trim().length < 6) throw new Error('password is too weak');
            
            const userCredential = await signInWithEmailAndPassword(emailAuth, email, password);
            return { data: userCredential.user, error: null }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const quit = useCallback(async () => {
        try {
            await signOut(emailAuth);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { error, loading, quit, signIn, signUp, user }
}