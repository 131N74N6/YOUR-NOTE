import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSupabaseTable } from '../services/useSupabaseTable';
import { useAuth } from '../services/useAuth';
import type { BalanceDetail, BalanceSummaries } from '../services/custom-types';
import { Navbar1, Navbar2 } from '../components/Navbar';
import BalanceForm from '../components/BalanceForm';
import BalanceList from '../components/BalanceList';
import BalanceSummary from '../components/BalanceSummary';
import BalanceNotification from '../components/BalanceNotification';

export default function Balance() {
    const { user } = useAuth();
    const financeTable = 'finance_list';
    
    const { realtimeInit, initTableData, insertData, updateData, deleteData } = useSupabaseTable<BalanceDetail>();
    
    const { data: balanceData = [], error, isLoading } = initTableData({
        tableName: financeTable,
        uniqueQueryKey: user?.id ? [user.id] : ['no-user'],
        additionalQuery: (addQuery) => user?.id ? addQuery.eq('user_id', user.id) : addQuery,
    });
    
    useEffect(() => {
        if (user?.id) {
            realtimeInit({
                tableName: financeTable,
                uniqueQueryKey: [user.id],
                additionalQuery: (query) => query.eq('user_id', user.id),
            });
        }
    }, [user?.id, realtimeInit]);
    
    const insertMutation = insertData();
    const updateMutation = updateData();
    const deleteMutation = deleteData();
    
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    
    const balanceSummary = useMemo((): BalanceSummaries => {
        let totalIncome = 0;
        let totalExpense = 0;
        
        balanceData.forEach(item => {
        if (item.type === 'income') {
            totalIncome += item.amount;
        } else {
            totalExpense += item.amount;
        }
        });
        
        return {
        totalIncome,
        totalExpense,
        balanceDifference: totalIncome - totalExpense
        };
    }, [balanceData]);
    
    // Sort data based on selected order
    const sortedData = useMemo(() => {
        const data = [...balanceData];
        
        if (sortOrder === 'oldest') {
        return data.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        } else {
        return data.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        }
    }, [balanceData, sortOrder]);
    
    // Handlers
    const handleAddBalance = useCallback(async (data: {
        amount: number;
        type: string;
        description: string;
    }) => {
        try {
        if (!user?.id) throw new Error('User not found');
        
        await insertMutation.mutateAsync({
            tableName: financeTable,
            newData: {
            ...data,
            user_id: user.id
            }
        });
        
        setShowForm(false);
        } catch (error: any) {
        setMessage(error.message);
        setShowMessage(true);
        }
    }, [user, insertMutation]);
    
    const handleUpdateBalance = useCallback(async (id: string, data: {
        amount: number;
        type: string;
        description: string;
    }) => {
        try {
        await updateMutation.mutateAsync({
            tableName: financeTable,
            values: id,
            column: 'id',
            newData: data
        });
        
        setSelectedId(null);
        } catch (error: any) {
        setMessage(error.message);
        setShowMessage(true);
        }
    }, [updateMutation]);
    
    const handleDeleteBalance = useCallback(async (id: string) => {
        try {
        await deleteMutation.mutateAsync({
            tableName: financeTable,
            column: 'id',
            values: id
        });
        } catch (error: any) {
        setMessage(error.message);
        setShowMessage(true);
        }
    }, [deleteMutation]);
    
    const handleDeleteAll = useCallback(async () => {
        try {
            if (!user?.id) throw new Error('User not found');
            
            await deleteMutation.mutateAsync({
                tableName: financeTable,
                column: 'user_id',
                values: user.id
            });
        } catch (error: any) {
            setMessage(error.message);
            setShowMessage(true);
        }
    }, [user, deleteMutation]);
    
    const handleSelectItem = useCallback((id: string) => {
        setSelectedId(prev => prev === id ? null : id);
    }, []);
    
    const handleSortChange = useCallback((order: 'newest' | 'oldest') => {
        setSortOrder(order);
    }, []);
    
    function openForm(): void {
        setShowForm(true);
    }

    // Close BalanceNotification after 3 seconds
    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showMessage]);
    
    if (error) {
        const errorMessage = error.name === "TypeError" && error.message === "Failed to fetch" 
        ? "Check your internet connection" 
        : error.message;
        return <div className="p-[1rem] text-center text-red-500">{errorMessage}</div>;
    }
    
    if (isLoading) {
        return <div className="p-[1rem] text-center">Loading balance data...</div>;
    }
    
    return (
        <div className="bg-white h-screen p-[1rem] relative z-10 flex flex-col md:flex-row gap-[1rem]">
            <Navbar1/>
            <Navbar2/>
            <section className="flex flex-col gap-[1rem] w-full">
                <section className="border-[1.3px] border-black p-[1rem]">
                    <BalanceSummary 
                        username={user?.email || 'User'}
                        summary={balanceSummary}
                    />
                
                    <section className="flex pt-[0.5rem] gap-[1rem] flex-wrap">
                        <button 
                            type="button" 
                            className="border-black border-[1.3px] text-[0.95rem] p-[0.45rem] cursor-pointer text-center font-mono font-[550] text-black"
                            onClick={handleDeleteAll}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete All'}
                        </button>
                        
                        <button 
                        type="button" 
                            className={`border-black border-[1.3px] text-[0.95rem] p-[0.45rem] cursor-pointer text-center font-mono font-[550] w-[95px] ${
                                sortOrder === 'oldest' ? 'bg-black text-white' : 'text-black'
                            }`}
                            onClick={() => handleSortChange('oldest')}
                        >
                            Oldest
                        </button>
                        
                        <button 
                            type="button" 
                            className={`border-black border-[1.3px] text-[0.95rem] p-[0.45rem] cursor-pointer text-center font-mono font-[550] w-[95px] ${
                                sortOrder === 'newest' ? 'bg-black text-white' : 'text-black'
                            }`}
                            onClick={() => handleSortChange('newest')}
                        >
                            Newest
                        </button>
                    <button 
                        type="button" 
                        className="bg-black border-0 rounded-lg text-white cursor-pointer text-[0.9rem] p-[0.4rem] font-[550]" 
                        onClick={openForm}
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Add Balance</span>
                    </button>
                    </section>
                </section>
                
                <BalanceList 
                    data={sortedData}
                    selectedId={selectedId}
                    onSelect={handleSelectItem}
                    onUpdate={handleUpdateBalance}
                    onDelete={handleDeleteBalance}
                />
            </section>
            
            {showForm ? 
                <BalanceForm 
                    onSubmit={handleAddBalance}
                    onClose={() => setShowForm(false)}
                />
            : null}
            
            {showMessage ?
                <BalanceNotification 
                    message={message}
                    onClose={() => setShowMessage(false)}
                    className="border border-black p-[0.5rem] text-[1rem] w-[280px]"
                />
            : null}
        </div>
    );
}