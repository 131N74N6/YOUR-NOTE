import { Navbar1, Navbar2 } from "../components/Navbar";
import DataModifier from "../services/data.service";
import AuthServices from "../services/auth.service";
import type { IBalanceSummary } from "../models/balance-model";

export default function Home() {
    const { currentUserId, currentUserName } = AuthServices();
    const { getData } = DataModifier();

    const { data: balanceSummary, isLoading: isBalanceLoading } = getData<IBalanceSummary>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/balances/summary/${currentUserId}`,
        stale_time: Infinity,
        query_key: [`balance-total-${currentUserId}`]
    });

    const { data: activityTotal, isLoading: isActivityLoading } = getData<number>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/summary/${currentUserId}`,
        stale_time: Infinity,
        query_key: [`act-total-${currentUserId}`]
    });

    const { data: noteTotal, isLoading: isNoteLoading } = getData<number>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/notes/summary/${currentUserId}`,
        stale_time: Infinity,
        query_key: [`note-total-${currentUserId}`]
    });

    return (
        <div className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <Navbar1/>
            <Navbar2/>
            <div className="p-[1rem] border border-white overflow-y-auto h-full md:w-3/4 w-full gap-4 flex flex-col rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="border border-white p-4">
                    <h2 className="text-white font-[600] text-[1.5rem]">Welcome back, {currentUserName}!</h2>
                    <p className="text-white font-[400] text-[1rem]">Here's a quick overview of your finances and activities.</p>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-[1rem]">
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        {isBalanceLoading ? <span className="flex justify-center items-center">Loading...</span> : (
                            <>
                                <h3>Income Total</h3>
                                <p>{balanceSummary ? balanceSummary.income : 0}</p>
                            </>
                        )}
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        {isBalanceLoading ? <span className="flex justify-center items-center">Loading...</span> : (
                            <>
                                <h3>Expense Total</h3>
                                <p>{balanceSummary ? balanceSummary.expense : 0}</p>
                            </>
                        )}
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        {isBalanceLoading ? <span className="flex justify-center items-center">Loading...</span> : (
                            <>
                                <h3>Balances</h3>
                                <p>{balanceSummary ? balanceSummary.balance : 0}</p>
                            </>
                        )}
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        {isActivityLoading ? <span className="flex justify-center items-center">Loading...</span> : (
                            <>
                                <h3>Activity to do</h3>
                                <p>{activityTotal ? activityTotal : 0}</p>
                            </>
                        )}
                    </div>
                    <div className="border border-white h-[200px] p-[0.7rem] text-white font-[500]">
                        {isNoteLoading ? (
                            <span className="flex justify-center items-center">Loading...</span> 
                        ) : (
                            <>
                                <h3>Notes</h3>
                                <p>{noteTotal ? noteTotal : 0}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}