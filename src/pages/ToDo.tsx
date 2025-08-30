import ListAct from "../components/ListAct";
import { Navbar1 } from "../components/Navbar";
import type { Activity } from "../services/custom-types";
import { useAuth } from "../services/useAuth";
import { useSupabaseTable } from "../services/useSupabaseTable";
import Notification from "../components/Notification";
import { useState } from "react";
import ListActForm from "../components/ListActForm";

export default function ToDo() {
    const activityTable = 'activity_list';
    const { user } = useAuth();
    const { data, insertData, isLoading, error, deleteData } = useSupabaseTable<Activity>({ 
        tableName: activityTable, 
        uniqueQueryKey: user?.id ? [user.id] : ['no-user'],
        filterKey: user?.id ? `user_id=eq.${user.id}` : undefined,
        additionalQuery: (addQuery) => addQuery.eq('user_id', user?.id)
    });
    
    const [message, setMessage] = useState<string>('');
    const [activity, setActivity] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectId, setSelectId] = useState<string | null>(null);

    async function addActivity(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        const trimmedActivity = activity.trim();

        try {            
            if (!user?.id) return;

            if (trimmedActivity === '') throw new Error('Missing required data!');

            await insertData({
                tableName: activityTable,
                newData: {
                    act_name: trimmedActivity,
                    user_id: user?.id
                }
            });
        } catch (error: any) {
            setShowMessage(true);
            setMessage(error.message);
        } finally {
            setShowForm(false);
            setTimeout(() => setShowMessage(false), 3000);
        }
    }

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

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);

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
                {showForm ? 
                    <ListActForm 
                        onSend={addActivity}
                        actName={activity} 
                        onChangeActName={(event: React.ChangeEvent<HTMLInputElement>) => setActivity(event.target.value)}
                        onClose={closeForm}
                    /> 
                : null}
                <div className="flex flex-col gap-[1rem] max-sm:pb-[1rem] w-full">
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
                            onClick={openForm}
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Add List</span>
                        </button>
                    </div>
                    <main className="w-full flex flex-col border p-[1rem] gap-[1rem] border-black rounded-lg overflow-auto">
                        {data.length > 0 ? data.map((act) => <ListAct 
                            id={act.id} created_at={act.created_at} user_id={act.user_id}
                            act_name={act.act_name} key={act.id}
                            onDelete={deleteSelectedActivity} 
                            onSelect={setSelectId}
                            selectedId={selectId}
                        />) 
                        : <div className="flex justify-center items-center h-screen">
                            <span className="text-red-600 font-[600] text-[1.3rem]">'No activity added currently...'</span>
                        </div>}
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