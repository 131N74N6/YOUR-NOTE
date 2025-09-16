import { Navbar1, Navbar2 } from "../components/Navbar";
import Pagination from "../components/Pagination";
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

    const { currentPage, data: balanceData, error, loading, nextPage, prevPage, totalPages } = realTimeInit({
        collection_name: collectionName,
        filters: user ? [['user_id', '==', user.uid]] : [],
        order_by_options: [['created_at', 'desc']],
        items_each_page: 10
    });

    async function saveBalances(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        if (!user) return;
        await insertData({
            collection_name: collectionName,
            new_data: {
                amount: Number(amount),
                balance_type: amountType,
                description: description.trim(),
                user_id: user.uid
            }
        });
        setOpenForm(false);
    }

    const handleSelectItem = useCallback((id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }, []);

    async function deleteAllBalance(): Promise<void> {
        await deleteData({
            collection_name: collectionName,
            filters: [['user_id', '==', user?.uid]],
        })
    }

    async function deleteSelectedBalance(id: string): Promise<void> {
        await deleteData({
            collection_name: collectionName,
            values: id
        });
    }

    async function updateSelectedBalance(id: string, data: { 
        amount: number; 
        balance_type: 'income' | 'expense'; 
        description: string;
    }): Promise<void> {
        await updateData({ collection_name: collectionName, new_data: data, values: id });
    }

    if (loading) return <Loading/>

    if (error) return <div>Error</div>

    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full">
                <Pagination
                    currentPage={currentPage}
                    onNext={nextPage}
                    onPrev={prevPage}
                    totalPages={totalPages}
                />
                <div className="p-[1rem] h-[90%] flex flex-col gap-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                    <div className="flex gap-[0.7rem]">
                        <button 
                            onClick={() => setOpenForm(true)}
                            type="button" 
                            className="bg-white cursor-pointer text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                        >
                            Add Balances
                        </button>
                        <button 
                            onClick={deleteAllBalance}
                            type="button" 
                            className="bg-white cursor-pointer text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
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
                            description={description.trim()}
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