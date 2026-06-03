import { Navbar1, Navbar2 } from "../components/Navbar";
import BalanceList from "../components/BalanceList";
import { useEffect } from "react";
import BalanceForm from "../components/BalanceForm";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import BalanceServices from "../services/balance.service";

export default function Balances() {
    const { 
        allBalances, amount, amountType, changeBalanceMutation, closeForm, currentUserId, deleteAllBalanceMutation, 
        deleteOneBalanceMutation, description, handleSelectItem, isProcessing, message, openForm, saveBalances, selectedId, 
        setAmount, setAmountType, setDescription, setMessage, setOpenForm, setSelectedId
    } = BalanceServices();

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
                    isDataChanging={isProcessing}
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
                {allBalances.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : allBalances.error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-white font-[600] text-[1rem]">{allBalances.error.message || 'Failed to load your balance. Try again later.'}</p>
                    </div>
                ) : (
                    <BalanceList
                        balances={allBalances.paginatedData}
                        getMore={allBalances.fetchNextPage}
                        isDataChanging={isProcessing}
                        isLoadMore={allBalances.isFetchingNextPage}
                        isReachedEnd={allBalances.isReachedEnd}
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