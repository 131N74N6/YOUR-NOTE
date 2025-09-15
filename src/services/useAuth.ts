import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, type User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { db, emailAuth } from "./firebase-config";
import { doc, setDoc } from "firebase/firestore";

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

    const signUp = useCallback(async(email: string, username: string, password: string) => {
        setLoading(true);
        try {
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
            
        }
    }, []);

    return { signUp }
}