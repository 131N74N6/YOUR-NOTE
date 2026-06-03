import { useNavigate } from "react-router-dom";
import type { SignInIntrf, UserInfoIntrf } from "../models/user-model";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function AuthServices() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    const { data: currentUser, isLoading: userLoading, error: userError } = useQuery<UserInfoIntrf | null>({
        queryKey: ['current-user'],
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/user/show`, {});
                const response = await request.json();
                return response;
            } catch (error) {
                throw error;
            }
        },
        retry: false,
        staleTime: Infinity,
    });
    
    const currentUserId = currentUser ? currentUser.user_id : '';
    const currentUserName = currentUser ? currentUser.username : '';

    const signInMt = useMutation({
        mutationFn: async (props: SignInIntrf) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/sign-in`, {
                    body: JSON.stringify({ email: props.email, password: props.password }),
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST'
                });
                
                const response = await request.json();

                if (!request.ok) {
                    const errorMessage = response.message || 'Failed to sign in. Try again later';
                    throw new Error(errorMessage);
                } else {
                    
                    return response;
                }
            } catch (error: any) {
                throw error;
            } 
        },
        onError: (error) => {
            setError(error.message);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['current-user'] });
            navigate('/home');
        }
    });

    async function signUp(created_at: string, email: string, username: string, password: string) {
        try {
            const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/sign-up`, {
                credentials: 'include',
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ created_at, email, password, username }),
            });

            const response = await request.json();
            
            if (!request.ok) {
                throw new Error(response.message || 'Failed to sign up. Try again later');
            } else {
                navigate('/sign-in');
            }
        } catch (err: any) {
            setError(err.message);
        } 
    }

    async function quit() {
        try {
            await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/sign-out`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json'},
                method: 'POST',
            });
        } catch (error) {
            //
        } finally {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            navigate('/sign-in');
        }
    }

    return { 
        currentUserId, currentUserName, currentUser, error, userError, userLoading, 
        quit, setError, signInMt, isSigningIn: signInMt.isPending, signUp 
    }
}