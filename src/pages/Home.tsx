import { Navbar1, Navbar2 } from "../components/Navbar";
import useFirestore from "../services/useFirestore";

export default function Home() {
    const balanceCollection = 'balances';
    const { summarize } = useFirestore();
    
    const incomeTotal = summarize({ 
        collection_name: balanceCollection, 
        field1: 'balance_type', 
        sign: '==', 
        field2: 'amount',
        values: 'income' 
    });
    
    const expenseTotal = summarize({ 
        collection_name: balanceCollection, 
        field1: 'balance_type', 
        sign: '==', 
        field2: 'amount',
        values: 'expense' 
    });

    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="p-[1rem] border border-white overflow-y-auto h-full md:w-3/4 w-full rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-[1rem]">
                    <div className="border border-white h-[200px] p-[0.7rem]">
                        <h3>Income Total</h3>
                        <p>{incomeTotal}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem]">
                        <h3>Expense Total</h3>
                        <p>{expenseTotal}</p>
                    </div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                    <div className="border border-white h-[200px]"></div>
                </div>
            </div>
        </div>
    );
}
