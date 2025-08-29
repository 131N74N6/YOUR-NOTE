import ListAct from "../components/ListAct";
import { Navbar1 } from "../components/Navbar";
import type { Activity } from "../services/custom-types";
import { useAuth } from "../services/useAuth";
import { useSupabaseTable } from "../services/useSupabaseTable";
import Notification from "../components/Notification";
import { useState } from "react";

export default function ToDo() {
    const activityTable = 'activity_list';
    const { user } = useAuth();
    const { data, isLoading, error, deleteData } = useSupabaseTable<Activity>({ 
        tableName: activityTable, 
        uniqueQueryKey: user?.id ? [user.id] : ['no-user'],
        filterKey: user?.id ? `user_id=eq.${user.id}` : undefined,
        additionalQuery: (addQuery) => addQuery.eq('user_id', user?.id)
    });
    
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    async function deleteSelectedActivity(actId: string) {
        try {
            if (data.length > 0) {            
                await deleteData({ 
                    tableName: activityTable, 
                    column: 'id', 
                    values: actId 
                });
            } 
        } catch (error: any) {
            setShowMessage(true);
            setMessage(error.message);
        } finally {
            setTimeout(() => setShowMessage(false), 3000);
        }
    }

    async function deleteAllList(): Promise<void> {
        try {            
            await deleteData({
                tableName: activityTable,
                column: 'user_id',
                values: user?.id
            });
        } catch (error: any) {
            setShowMessage(true);
            setMessage(error.message);
        } finally {
            setTimeout(() => setShowMessage(false), 3000);
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        const errorMessage = error.name === "TypeError" && error.message === "Failed to fetch" 
            ? "Check your internet connection" 
            : error.message;
        return <div className="p-[1rem] text-center text-red-500">{errorMessage}</div>;
    }

    return (
        <>
            <div className="flex flex-col md:flex-row p-[1rem] gap-[1rem] h-screen">
                <Navbar1/>
                <div className="flex flex-col gap-[1rem] max-sm:pb-[1rem]">
                    <div className="flex gap-[0.5rem] p-[1rem] border border-black rounded-lg">
                        <button 
                            type="button" 
                            className="bg-black border-0 rounded-lg text-white cursor-pointer text-[0.9rem] p-[0.4rem] font-[550]" 
                            onClick={deleteAllList}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                            <span>Delete All</span>
                        </button>
                        <button 
                            type="button" 
                            className="bg-black border-0 rounded-lg text-white cursor-pointer text-[0.9rem] p-[0.4rem] font-[550]" 
                            onClick={deleteAllList}
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Add List</span>
                        </button>
                    </div>
                    <main className="w-full grid grid-cols-2 border p-[1rem] gap-[1rem] border-black rounded-lg overflow-auto">
                        {data.map((act) => <ListAct 
                            id={act.id} created_at={act.created_at} user_id={act.user_id}
                            act_name={act.act_name} key={act.id}
                            onDelete={deleteSelectedActivity} 
                            onSelect={deleteSelectedActivity}
                        />)}
                    </main>
                </div>
                {showMessage ?
                    <div className="flex justify-center items-center inset-0 fixed">
                        <Notification message={message} class_name="border border-black p-[0.5rem] text-[1rem] w-[280px]"/>
                    </div>
                : null}
            </div>
        </>
    );
}
