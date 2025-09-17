import { Navbar1, Navbar2 } from "../components/Navbar";
import BalanceList from "../components/BalanceList";
import { useCallback, useState } from "react";
import BalanceForm from "../components/BalanceForm";
import useAuth from "../services/useAuth";
import useFirestore from "../services/useFirestore";
import type { IBalance } from "../services/custom-types";
import Loading from "../components/Loading";

export default function Balances() {
    const [amount, setAmount] = useState<string>('');
    const [amountType, setAmountType] = useState<'income' | 'expense'>('income');
    const [description, setDescription] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>('');

    const { user } = useAuth();
    const collectionName = 'balances';
    const { deleteData, insertData, realTimeInit, updateData } = useFirestore<IBalance>();

    const { data: balanceData, error, loading } = realTimeInit({
        collection_name: collectionName,
        filters: user ? [['user_id', '==', user.uid]] : [],
        order_by_options: [['created_at', 'desc']]
    });

    const saveBalances = useCallback(async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const trimmedAmount = Number(amount.trim());
        const trimmedDescription = description.trim();

        if (!user) return;

        await insertData({
            collection_name: collectionName,
            new_data: {
                amount: trimmedAmount,
                balance_type: amountType,
                description: trimmedDescription,
                user_id: user.uid
            }
        });

        resetForm();
    }, [user, amount, amountType, description, insertData, collectionName]);

    const handleSelectItem = useCallback((id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }, []);

    const deleteAllBalance = useCallback(async (): Promise<void> => {
        await deleteData({
            collection_name: collectionName,
            filters: [['user_id', '==', user?.uid]],
        });
    }, [balanceData, user]);

    const deleteSelectedBalance = useCallback(async (id: string): Promise<void> => {
        await deleteData({
            collection_name: collectionName,
            values: id
        });
    }, []);

    const updateSelectedBalance = useCallback(async (id: string, data: { 
        amount: number; 
        balance_type: 'income' | 'expense'; 
        description: string;
    }): Promise<void> => {
        await updateData({ collection_name: collectionName, new_data: data, values: id });
        setSelectedId(null);
    }, [user]);

    const resetForm = useCallback(() => {
        setAmount('');
        setAmountType('income');
        setDescription('');
        setOpenForm(false);
    }, []);

    if (loading) return <Loading/>

    if (error) return <div>Error</div>

    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full">
                <div className="p-[1rem] h-[90%] flex flex-col gap-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
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
                            onClose={() => setOpenForm(false)}
                        /> 
                    : null}
                    <BalanceList
                        data={balanceData}
                        onDelete={deleteSelectedBalance}
                        onSelect={handleSelectItem}
                        onUpdate={updateSelectedBalance}
                        selectedId={selectedId}
                    />
                </div>
            </div>
        </div>
    );
}