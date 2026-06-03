import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { INote } from "../models/note-model";
import { useNavigate } from "react-router-dom";
import AuthServices from "./auth.service";
import DataModifier from "./data.service";
import { useState } from "react";

export default function NoteServices() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { currentUserId } = AuthServices();
    const { deleteData, infiniteScroll, insertData, message, setMessage, updateData } = DataModifier();

    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const { 
        paginatedData, 
        error,
        fetchNextPage,
        isFetchingNextPage,
        isReachedEnd,
        isLoading 
    } = infiniteScroll<INote>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/get-all/${currentUserId}`,
        query_key: [`notes-${currentUserId}`],
        stale_time: 1800000,
        limit: 12
    });

    const notes = { paginatedData, error, fetchNextPage, isFetchingNextPage, isReachedEnd, isLoading }

    function changeNote(_id: string) {
        return useMutation({
            onMutate: () => setIsProcessing(true),
            mutationFn: async () => {
                if (!_id) throw new Error('Note not found');

                await updateData<INote>({ 
                    api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/change/${_id}`,
                    api_data: {
                        note_content: content.trim(),
                        note_title: title.trim(),
                    }
                });
            },
            onError: () => {},
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [`selected-notes-${_id}`] });
                queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
            },
            onSettled: () => setIsProcessing(false)
        });
    }

    function getSelectedNote(_id: string) {
        const { data, error, isLoading } = useQuery<INote[], Error>({
            enabled: !!_id && !!currentUserId,
            queryFn: async () => {
                try {
                    const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/notes/selected/${_id}`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'GET'
                    });

                    const response = await request.json();

                    if (!request.ok) {
                        const errorMessage = response.message || 'Failed to fetch data. Try again later';
                        throw new Error(errorMessage);
                    } 
                    return response;
                } catch (error) {
                    throw error;
                }
            },
            queryKey: [`selected-notes-${_id}`],
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
            staleTime: 1800000
        });

        return { data, error, isLoading }
    }
    
    const deleteOneNoteMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/erase/${id}` })
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteManyNotesMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            if (!currentUserId) return;
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/erase-all/${currentUserId}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const insertNoteMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await insertData<INote>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/add`,
                api_data: {
                    created_at: new Date().toISOString(),
                    note_content: content.trim(),
                    note_title: title.trim(),
                    user_id: currentUserId
                }
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to add note. Try again later');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${currentUserId}`] });
            navigate('/notes');
        },
        onSettled: () => {
            resetForm();
            setIsProcessing(false);
        }
    });

    const addNote = (event: React.FormEvent): void => {
        event.preventDefault();
        insertNoteMutation.mutate();
    }
    
    const resetForm = () => {
        setTitle('');
        setContent('');
    }

    return { 
        addNote, changeNote, content, currentUserId, deleteOneNoteMutation, deleteManyNotesMutation, getSelectedNote, 
        isProcessing, message, navigate, notes, resetForm, setContent, setIsProcessing, setMessage, setTitle, title 
    }
}