import useSWR from "swr";
import { Navbar1, Navbar2 } from "../components/Navbar";
import useApiCalls from "../services/data-modifier";
import useAuth from "../services/useAuth";

type IIncome = {
    _id: string;
    total: number;
}

type IExpense = IIncome;

type IBalanceSummary = {
    income: IIncome[];
    expense: IExpense[];
    balance: number;
}

export default function Home() {
    const { user } = useAuth();
    const { getData: getBalanceSummary } = useApiCalls();
    const { getData: getActivityTotal } = useApiCalls();
    const { getData: getNoteTotal } = useApiCalls();

    const { data: balanceSummary } = useSWR<IBalanceSummary>(
        user ? `http://localhost:1234/balances/summary/${user.info.id}`: '',
        getBalanceSummary
    );

    const { data: activityTotal } = useSWR<number>(
        user ? `http://localhost:1234/activities/summary/${user.info.id}`: '',
        getActivityTotal
    );

    const { data: noteTotal } = useSWR<number>(
        user ? `http://localhost:1234/notes/summary/${user.info.id}`: '',
        getNoteTotal
    );

    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="p-[1rem] border border-white overflow-y-auto h-full md:w-3/4 w-full rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-[1rem]">
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Income Total</h3>
                        <p>{balanceSummary ? balanceSummary.income[0].total : 0}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Expense Total</h3>
                        <p>{balanceSummary ? balanceSummary.expense[0].total : 0}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Expense Total</h3>
                        <p>{balanceSummary ? balanceSummary.balance : 0}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Activity to do</h3>
                        <p>{activityTotal}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Notes</h3>
                        <p>{noteTotal}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}