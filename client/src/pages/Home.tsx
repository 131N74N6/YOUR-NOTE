import { Navbar1, Navbar2 } from "../components/Navbar";
import DataModifier from "../services/data-modifier";
import useAuth from "../services/useAuth";

type IBalanceSummary = {
    income: number;
    expense: number;
    balance: number;
}

export default function Home() {
    const { user } = useAuth();
    const { getData } = DataModifier();

    const { data: balanceSummary } = getData<IBalanceSummary>({
        api_url: user ? `http://localhost:1234/balances/summary/${user.info.id}` : '',
        stale_time: 600000,
        query_key: [`balance-total-${user?.info.id}`]
    });

    const { data: activityTotal } = getData<number>({
        api_url: user ? `http://localhost:1234/activities/summary/${user.info.id}` : '',
        stale_time: 600000,
        query_key: [`act-total-${user?.info.id}`]
    });

    const { data: noteTotal } = getData<number>({
        api_url: user ? `http://localhost:1234/notes/summary/${user.info.id}` : '',
        stale_time: 600000,
        query_key: [`note-total-${user?.info.id}`]
    });

    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="p-[1rem] border border-white overflow-y-auto h-full md:w-3/4 w-full rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-[1rem]">
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Income Total</h3>
                        <p>{balanceSummary ? balanceSummary.income : 0}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Expense Total</h3>
                        <p>{balanceSummary ? balanceSummary.expense : 0}</p>
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        <h3>Balances</h3>
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