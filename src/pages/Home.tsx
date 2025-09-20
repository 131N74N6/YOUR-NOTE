import { useCallback, useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import useFirestore from "../services/useFirestore";
import useAuth from "../services/useAuth";

type ICalculation = {
    activity_total: number;
    balance: number;
    expense: number; 
    income: number; 
}

export default function Home() {
    const balanceCollection = 'balances';
    const activityCollection = 'activities';

    const { user } = useAuth();
    const { summarize, countData } = useFirestore();

    const [summary, setSummary] = useState<ICalculation>({
        income: 0,
        expense: 0,
        balance: 0,
        activity_total: 0
    });

    const getCalculation = useCallback(async () => {
        const [activityTotal, incomeTotal, expenseTotal] = await Promise.all([
            countData({
                collection_name: activityCollection,
                field1: 'user_id',
                sign: '==',
                values: user ? user.uid : ''
            }),
            summarize({ 
                collection_name: balanceCollection, 
                field1: 'balance_type', 
                sign: '==', 
                field2: 'amount',
                values: 'income' 
            }),
            summarize({ 
                collection_name: balanceCollection, 
                field1: 'balance_type', 
                sign: '==', 
                field2: 'amount',
                values: 'expense' 
            }),
        ]);

        setSummary({
            activity_total: activityTotal,
            balance: incomeTotal - expenseTotal,
            expense: expenseTotal,
            income: incomeTotal,
        });
    }, [summarize]);

    useEffect(() => {
        getCalculation();
    }, [getCalculation]);

    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="p-[1rem] border border-white overflow-y-auto h-full md:w-3/4 w-full rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-[1rem]">
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Income Total</h3>
                        <p>{summary.income}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Expense Total</h3>
                        <p>{summary.expense}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Expense Total</h3>
                        <p>{summary.balance}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Activity to do</h3>
                        <p>{summary.activity_total}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
