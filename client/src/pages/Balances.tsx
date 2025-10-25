import { Navbar1, Navbar2 } from "../components/Navbar";
import BalanceList from "../components/BalanceList";
import { useEffect, useState } from "react";
import BalanceForm from "../components/BalanceForm";
import useAuth from "../services/useAuth";
import type { IBalance, UpdateBalanceProps } from "../services/custom-types";
import Loading from "../components/Loading";
import DataModifier from "../services/data-modifier";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Balances() {
    const { user } = useAuth();
    const { deleteData, infiniteScroll, insertData, updateData } = DataModifier();
    const queryClient = useQueryClient();

    const [amount, setAmount] = useState<string>('');
    const [amountType, setAmountType] = useState<'income' | 'expense'>('income');
    const [description, setDescription] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>('');
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const { 
        paginatedData: balanceData, 
        fetchNextPage,
        isFetchingNextPage,
        isReachedEnd,
        isLoading 
    } = infiniteScroll<IBalance>({
        api_url: `http://localhost:1234/balances/get-all/${user?.info.id}`,
        query_key: [`balances-${user?.info.id}`],
        stale_time: 1000,
        limit: 12
    });

    const changeBalanceMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (selected: UpdateBalanceProps) => {
            if (isNaN(selected.amount) || selected.amount <= 0) throw new Error('Enter proper amount');
            if (!selected.balance_type || !selected.description.trim()) throw new Error('Fill these too');

            await updateData<IBalance>({ 
                api_url: `http://localhost:1234/balances/change/${selected._id}`,
                api_data: { 
                    amount: selected.amount, 
                    description: selected.description, 
                    balance_type: selected.balance_type 
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${user?.info.id}`] });
        },
        onSettled: () => {
            setIsDataChanging(false);
            setSelectedId(null);
        }
    });

    const deleteAllBalanceMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            if (!user) return;
            await deleteData({ api_url: `http://localhost:1234/balances/erase-all/${user.info.id}` });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${user?.info.id}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${user?.info.id}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const deleteOneBalanceMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `http://localhost:1234/balances/erase/${id}` });
            if (selectedId === id) setSelectedId(null);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${user?.info.id}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${user?.info.id}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const insertBalanceMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            const trimmedAmount = Number(amount.trim());
            const trimmedDescription = description.trim();
            const getCurrentDate = new Date();

            if (!user) return;

            await insertData<IBalance>({
                api_url: 'http://localhost:1234/balances/add',
                api_data: {
                    amount: trimmedAmount,
                    balance_type: amountType,
                    created_at: getCurrentDate.toISOString(),
                    description: trimmedDescription,
                    user_id: user.info.id
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`balances-${user?.info.id}`] });
            queryClient.invalidateQueries({ queryKey: [`balance-total-${user?.info.id}`] });
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

    const deleteAllBalance = async (): Promise<void> => {
        deleteAllBalanceMutation.mutate();
    }

    const deleteSelectedBalance = (id: string): void => {
        deleteOneBalanceMutation.mutate(id);
    }

    const updateSelectedBalance = (selected: UpdateBalanceProps): void => {
        changeBalanceMutation.mutate(selected);
    }

    const closeForm = (): void => {
        setAmount('');
        setAmountType('income');
        setDescription('');
        setOpenForm(false);
    }

    useEffect((): void => {
        if (!user) {
            closeForm();
            setSelectedId(null);
        }
    }, [user, closeForm]);

    if (isLoading) return <Loading/>

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            {openForm ? 
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
            : null}
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full min-h-[500px] p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="flex gap-[0.7rem]">
                    <button 
                        onClick={() => setOpenForm(true)}
                        type="button" 
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Add Balances
                    </button>
                    <button 
                        onClick={deleteAllBalance}
                        type="button" 
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Delete All Balances
                    </button>
                </div>
                <BalanceList
                    data={balanceData ? balanceData : []}
                    getMore={fetchNextPage}
                    isDataChanging={isDataChanging}
                    isLoadMore={isFetchingNextPage}
                    isReachedEnd={isReachedEnd}
                    onDelete={deleteSelectedBalance}
                    onSelect={handleSelectItem}
                    onUpdate={updateSelectedBalance}
                    selectedId={selectedId}
                />
            </div>
        </main>
    );
}