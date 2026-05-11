import { Navbar1, Navbar2 } from "../components/Navbar";
import BalanceList from "../components/BalanceList";
import { useEffect, useState } from "react";
import BalanceForm from "../components/BalanceForm";
import useAuth from "../services/auth-services";
import type { IBalance, UpdateBalanceProps } from "../models/balance-model";
import Loading from "../components/Loading";
import DataModifier from "../services/data-services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "../components/Notification";

export default function Balances() {
    const { currentUserId } = useAuth();
    const { deleteData, infiniteScroll, insertData, message, setMessage, updateData } = DataModifier();
    const queryClient = useQueryClient();

    const [amount, setAmount] = useState<string>('');
    const [amountType, setAmountType] = useState<'income' | 'expense'>('income');
    const [description, setDescription] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>('');
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const { 
        paginatedData: balanceData, 
        error,
        fetchNextPage,
        isFetchingNextPage,
        isReachedEnd,
        isLoading 
    } = infiniteScroll<IBalance>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/get-all/${currentUserId}`,
        query_key: [`balances-${currentUserId}`],
        stale_time: 1800000,
        limit: 12
    });

    const changeBalanceMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (selected: UpdateBalanceProps) => {
            if (isNaN(selected.amount) || selected.amount <= 0) throw new Error('Enter proper amount');
            if (!selected.balance_type || !selected.description.trim()) throw new Error('Fill these too');

            await updateData<IBalance>({ 
                api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/change/${selected._id}`,
                api_data: { 
                    amount: selected.amount, 
                    description: selected.description, 
                    balance_type: selected.balance_type 
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${currentUserId}`] });
        },
        onSettled: () => {
            setIsDataChanging(false);
            setSelectedId(null);
        }
    });

    const deleteAllBalanceMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/erase-all/${currentUserId}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${currentUserId}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const deleteOneBalanceMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/erase/${id}` });
            if (selectedId === id) setSelectedId(null);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${currentUserId}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const insertBalanceMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            await insertData<IBalance>({
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
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${currentUserId}`] });
        },
        onSettled: () => {
            closeForm();
            setIsDataChanging(false);
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

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect((): void => {
        if (!currentUserId) {
            closeForm();
            setSelectedId(null);
            setMessage(null);
        }
    }, [currentUserId, closeForm]);

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            {openForm ? (
                <BalanceForm 
                    amount={Number(amount)}
                    changeAmount={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
                    balance_type={amountType}
                    changeToExpense={() => setAmountType('expense')}
                    changeToIncome={() => setAmountType('income')}
                    description={description}
                    changeDescription={(event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
                    onSave={saveBalances}
                    onClose={closeForm}
                    isDataChanging={isDataChanging}
                /> 
            ) : null}
            {message ? Notification(message) : null}
            <div className="flex flex-col h-full min-h-[200px] gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="flex gap-[0.7rem]">
                    <button 
                        onClick={() => setOpenForm(true)}
                        type="button" 
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Add Balances
                    </button>
                    <button 
                        onClick={() => deleteAllBalanceMutation.mutate()}
                        type="button" 
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Delete All Balances
                    </button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-white font-[600] text-[1rem]">{error.message || 'Failed to load your balance. Try again later.'}</p>
                    </div>
                ) : (
                    <BalanceList
                        balances={balanceData ? balanceData : []}
                        getMore={fetchNextPage}
                        isDataChanging={isDataChanging}
                        isLoadMore={isFetchingNextPage}
                        isReachedEnd={isReachedEnd}
                        onDelete={deleteOneBalanceMutation}
                        onSelect={handleSelectItem}
                        onUpdate={changeBalanceMutation}
                        selectedId={selectedId}
                    />
                )}
            </div>
        </main>
    );
}