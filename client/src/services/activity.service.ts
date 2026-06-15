import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthServices from "./auth.service";
import type { IActivity, UpdateActivityDataProps } from "../models/activity.types";
import { useState } from "react";
import DataModifier from "./data.service";

export default function ActivityServices() {
    const { currentUserId } = AuthServices();
    const { deleteData, infiniteScroll, insertData, message, setMessage, updateData } = DataModifier();
    const queryClient = useQueryClient();

    const [actName, setActName] = useState<string>('');
    const [schedule, setSchedule] = useState<string>('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const { 
        paginatedData, 
        error,
        fetchNextPage,
        isFetchingNextPage,
        isLoading, 
        isReachedEnd 
    } = infiniteScroll<IActivity>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/get-all/${currentUserId}`,
        query_key: [`activities-${currentUserId}`],
        stale_time: Infinity,
        limit: 12
    });

    const allActivities = { paginatedData, error, fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd }

    const changeActMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (selected: UpdateActivityDataProps) => {
            return await updateData<IActivity>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/change/${selected._id}`,
                api_data: { act_name: selected.act_name, schedule_at: selected.schedule_at }
            });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`activities-${currentUserId}`] });
        },
        onSettled: () => {
            setIsProcessing(false);
            setSelectedId(null);
        }
    });

    const insertActMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await insertData<IActivity>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/add`,
                api_data: {
                    act_name: actName.trim(),
                    created_at: new Date().toISOString(),
                    schedule_at: new Date(schedule).toISOString(),
                    user_id: currentUserId
                }
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to add');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`activities-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`act-total-${currentUserId}`] });
        },
        onSettled: () => {
            setIsProcessing(false);
            closeForm();
        }
    });

    const deleteOneActMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/erase/${id}` });
            if (selectedId === id) setSelectedId(null);
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`activities-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`act-total-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteAllActMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/erase-all/${currentUserId}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`activities-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`act-total-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const saveActName = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        insertActMutation.mutate();
    }

    const handleSelectAct = (id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }

    const closeForm = (): void => {
        setActName('');
        setSchedule('');
        setOpenForm(false);
    }

    return { 
        allActivities, actName, changeActMutation, currentUserId, closeForm, deleteAllActMutation, deleteOneActMutation, 
        handleSelectAct, isProcessing, message, openForm, saveActName, schedule, selectedId, setActName, setSchedule, 
        setOpenForm, setSelectedId, setMessage 
    }
}