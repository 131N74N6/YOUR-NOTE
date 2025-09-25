import { Navbar1, Navbar2 } from "../components/Navbar";
import BalanceList from "../components/BalanceList";
import { useEffect, useState } from "react";
import BalanceForm from "../components/BalanceForm";
import useAuth from "../services/useAuth";
import useApiCalls from "../services/data-modifier";
import type { IBalance } from "../services/custom-types";
import Loading from "../components/Loading";
import useSWR from "swr";

export default function Balances() {
    const [amount, setAmount] = useState<string>('');
    const [amountType, setAmountType] = useState<'income' | 'expense'>('income');
    const [description, setDescription] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>('');
    const { user } = useAuth();
    
    const { deleteData, getData, insertData, updateData } = useApiCalls<IBalance>();

    const { data: balanceData, isLoading, mutate } = useSWR<IBalance[]>(
        user ? `http://localhost:1234/balances/get-all/${user.info.id}` : null, 
        getData, 
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // Reduce unnecessary requests
            errorRetryCount: 3,
        }
    );

    const saveBalances = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const trimmedAmount = Number(amount.trim());
        const trimmedDescription = description.trim();
        const getCurrentDate = new Date();

        if (!user) return;

        await insertData({
            api_url: 'http://localhost:1234/balances/add',
            api_data: {
                amount: trimmedAmount,
                balance_type: amountType,
                created_at: getCurrentDate.toISOString(),
                description: trimmedDescription,
                user_id: user.info.id
            }
        });

        mutate();
        closeForm();
    }

    const handleSelectItem = (id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }

    const deleteAllBalance = async (): Promise<void> => {
        if (!user) return;
        await deleteData({ api_url: `http://localhost:1234/balances/erase-all/${user.info.id}` });
        mutate();
    }

    const deleteSelectedBalance = async (id: string): Promise<void> => {
        if (!user) return;
        await deleteData({ api_url: `http://localhost:1234/balances/erase/${id}` });
        mutate();
        if (selectedId === id) setSelectedId(null);
    }

    const updateSelectedBalance = async (id: string, data: { 
        amount: number; 
        balance_type: 'income' | 'expense'; 
        description: string;
    }): Promise<void> => {
        if (!user) return;
        try {
            if (isNaN(data.amount) || data.amount <= 0) throw new Error('Enter proper amount');
            if (!data.balance_type || !data.description.trim()) throw new Error('Fill these too');

            await updateData({ 
                api_url: `http://localhost:1234/balances/change/${id}`,
                api_data: data
            });
        } catch (error: any) {
            console.error(error.message);
        } finally {
            mutate();
            setSelectedId(null);
        }
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
                /> 
            : null}
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
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
                    onDelete={deleteSelectedBalance}
                    onSelect={handleSelectItem}
                    onUpdate={updateSelectedBalance}
                    selectedId={selectedId}
                />
            </div>
        </main>
    );
}