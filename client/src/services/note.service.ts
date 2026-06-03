import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import type { INote } from "../models/note-model";
import { useNavigate } from "react-router-dom";
import AuthServices from "./auth.service";
import DataModifier from "./data.service";
import { useState } from "react";

export default function NoteServices() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { currentUserId } = AuthServices();
    const { deleteData, getData, infiniteScroll, insertData, message, setMessage, updateData } = DataModifier();

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

    const notes = { paginatedData, error, fetchNextPage, isFetchingNextPage, isReachedEnd, isLoading };

    const changeNoteMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (_id: string) => {
            return await updateData<INote>({ 
                api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/change/${_id}`,
                api_data: {
                    note_content: content.trim(),
                    note_title: title.trim(),
                }
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to save edited note');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.removeQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryKey[0].startsWith('selected-notes-') ||
                        queryKey[0].startsWith(`notes-${currentUserId}`)
                    }
                    return false;
                }
            });
        },
        onSettled: () => setIsProcessing(false)
    });
    
    const deleteOneNoteMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            return await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/erase/${id}` })
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`notes-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`note-total-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteManyNotesMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/erase-all/${currentUserId}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete');
        },
        onSuccess: (response) => {
            setMessage(response.message);
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
        addNote, changeNoteMutation, content, currentUserId, deleteOneNoteMutation, deleteManyNotesMutation, getData, 
        isProcessing, message, navigate, notes, resetForm, setContent, setIsProcessing, setMessage, setTitle, title 
    }
}