import { Navbar1, Navbar2 } from "../components/Navbar";
import BalanceList from "../components/BalanceList";
import { useCallback, useEffect, useState } from "react";
import BalanceForm from "../components/BalanceForm";
import useAuth from "../services/useAuth";
import useApiCalls from "../services/useModifyData";
import type { IBalance } from "../services/custom-types";
import Loading from "../components/Loading";
import useSWR, { useSWRConfig } from "swr";

export default function Balances() {
    const [amount, setAmount] = useState<string>('');
    const [amountType, setAmountType] = useState<'income' | 'expense'>('income');
    const [description, setDescription] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>('');
    const { user } = useAuth();
    const token = user?.token;
    
    const { deleteData, insertData, updateData } = useApiCalls<IBalance>();
    const { mutate } = useSWRConfig();

    const fetcher = async () => {
        if (!user) return;
        const request = await fetch(`http://localhost:1234/balances/get-all/${user.info.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();
        return response;
    }

    const { data: balanceData, isLoading } = useSWR<IBalance[]>(`balances-${user?.info.id}`, fetcher);

    const saveBalances = useCallback(async (event: React.FormEvent): Promise<void> => {
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
        mutate(`balances-${user.info.id}`);
        closeForm();
    }, [user, amount, amountType, description]);

    const handleSelectItem = useCallback((id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }, []);

    const deleteAllBalance = useCallback(async (): Promise<void> => {
        if (!user) return;
        await deleteData({ api_url: `http://localhost:1234/balances/erase-all/${user.info.id}` });
        mutate(`balances-${user.info.id}`);
    }, [balanceData, user]);

    const deleteSelectedBalance = useCallback(async (id: string): Promise<void> => {
        if (!user) return;
        await deleteData({ api_url: `http://localhost:1234/balances/erase/${id}` });
        mutate(`balances-${user.info.id}`);
    }, []);

    const updateSelectedBalance = useCallback(async (id: string, data: { 
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
            setSelectedId(null);
        }
    }, []);

    const closeForm = useCallback((): void => {
        setAmount('');
        setAmountType('income');
        setDescription('');
        setOpenForm(false);
    }, []);

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
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full p-[1rem] h-[90%] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
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