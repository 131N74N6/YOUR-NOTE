import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthServices from "./auth.service";
import { useState } from "react";
import type { IBalance, UpdateBalanceProps } from "../models/balance.types";
import DataModifier from "./data.service";

export default function BalanceServices() {
    const { currentUserId } = AuthServices();
    const { deleteData, infiniteScroll, insertData, message, setMessage, updateData } = DataModifier();
    const queryClient = useQueryClient();

    const [amount, setAmount] = useState<string>('');
    const [amountType, setAmountType] = useState<'income' | 'expense'>('income');
    const [description, setDescription] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const { 
        paginatedData, 
        error,
        fetchNextPage,
        isFetchingNextPage,
        isReachedEnd,
        isLoading 
    } = infiniteScroll<IBalance>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/get-all/${currentUserId}`,
        query_key: [`balances-${currentUserId}`],
        stale_time: Infinity,
        limit: 12
    });

    const allBalances = { paginatedData, error, fetchNextPage, isLoading, isFetchingNextPage, isReachedEnd }

    const changeBalanceMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (selected: UpdateBalanceProps) => {
            return await updateData<IBalance>({ 
                api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/change/${selected._id}`,
                api_data: { 
                    amount: selected.amount, 
                    description: selected.description, 
                    balance_type: selected.balance_type 
                }
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to save edited balance');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`balances-${currentUserId}`] });
        },
        onSettled: () => {
            setIsProcessing(false);
            setSelectedId(null);
        }
    });

    const deleteAllBalanceMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/erase-all/${currentUserId}` });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete all balances');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`balances-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const deleteOneBalanceMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/erase/${id}` });
            if (selectedId === id) setSelectedId(null);
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to delete balance');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${currentUserId}`] });
        },
        onSettled: () => setIsProcessing(false)
    });

    const insertBalanceMutation = useMutation({
        onMutate: () => setIsProcessing(true),
        mutationFn: async () => {
            return await insertData<IBalance>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/add`,
                api_data: {
                    amount: Number(amount.trim()),
                    balance_type: amountType,
                    created_at: new Date().toISOString(),
                    description: description.trim(),
                    user_id: currentUserId
                }
            });
        },
        onError: (error) => {
            setMessage(error.message || 'Failed to add balance');
        },
        onSuccess: (response) => {
            setMessage(response.message);
            queryClient.invalidateQueries({ queryKey: [`balances-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${currentUserId}`] });
        },
        onSettled: () => {
            closeForm();
            setIsProcessing(false);
        }
    });

    const saveBalances = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        insertBalanceMutation.mutate();
    }

    const handleSelectItem = (id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }

    const closeForm = (): void => {
        setAmount('');
        setAmountType('income');
        setDescription('');
        setOpenForm(false);
    }

    return { 
        allBalances, amount, amountType, changeBalanceMutation, closeForm, currentUserId, deleteAllBalanceMutation, 
        deleteOneBalanceMutation, description, handleSelectItem, isProcessing, message, openForm, saveBalances, selectedId, 
        setAmount, setAmountType, setDescription, setIsProcessing, setMessage, setOpenForm, setSelectedId
    }
}