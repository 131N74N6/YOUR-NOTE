import ActivityList from "../components/ActivityList";
import { Navbar1, Navbar2 } from "../components/Navbar";
import type { Activity } from "../services/custom-types";
import { useAuth } from "../services/useAuth";
import { useSupabaseTable } from "../services/useSupabaseTable";
import Notification from "../components/Notification";
import { useCallback, useEffect, useState } from "react";
import ActivityForm from "../components/ActivityForm";

export default function ToDo() {
    const activityTable = 'activity_list';
    const { user } = useAuth();
    const { realtimeInit, initTableData, insertData, updateData, deleteData } = useSupabaseTable<Activity>();
    
    const { data = [], error, isLoading } = initTableData({
        tableName: activityTable,
        uniqueQueryKey: user?.id ? [user.id] : ['no-user'],
        additionalQuery: (addQuery) => user?.id ? addQuery.eq('user_id', user.id) : addQuery,
    });

    useEffect(() => {
        if (user?.id) {
            realtimeInit({
                tableName: activityTable,
                uniqueQueryKey: [user.id],
                additionalQuery: (query) => query.eq('user_id', user.id),
            });
        }

        return () => {};
    }, [user?.id, realtimeInit]);

    const insertMutation = insertData();
    const updateMutation = updateData();
    const deleteMutation = deleteData();

    const [message, setMessage] = useState<string>('');
    const [activity, setActivity] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectId, setSelectId] = useState<string | null>(null);

    const addActivity = useCallback(async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const trimmedActivity = activity.trim();

        try { 
            if (!user?.id) throw new Error('User not found!');
            if (trimmedActivity === '') throw new Error('Missing required data!');

            await insertMutation.mutateAsync({
                tableName: activityTable,
                newData: {
                    act_name: trimmedActivity,
                    user_id: user.id
                }
            });
            
            setActivity('');
            setShowForm(false);
        } catch (error: any) {
            setMessage(error.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    }, [user, activity, insertMutation]);

    const deleteSelectedActivity = useCallback(async (actId: string): Promise<void> => {
        try {
            await deleteMutation.mutateAsync({ 
                tableName: activityTable, 
                column: 'id', 
                values: actId 
            });
        } catch (error: any) {
            setMessage(error.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    }, [deleteMutation]);

    const updateSelectedActivity = async (actId: string, act_name: string ): Promise<void> => {
        try {
            if (!actId) throw new Error('Activity not found!');

            await updateMutation.mutateAsync({
                tableName: activityTable,
                column: 'id',
                values: actId,
                newData: {
                    act_name: act_name
                }
            });
            setSelectId(null);
        } catch (error: any) {
            setMessage(error.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    };

    const deleteAllList = useCallback(async(): Promise<void> =>  {
        try {            
            if (!user?.id) throw new Error('User not found!');
            
            await deleteMutation.mutateAsync({
                tableName: activityTable,
                column: 'user_id',
                values: user.id
            });
        } catch (error: any) {
            setMessage(error.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        } 
    }, [user, deleteMutation]);

    const selectActivity = useCallback((id: string) => {
        setSelectId(prev => prev === id ? null : id);
    }, []);

    const openForm = useCallback(() => setShowForm(true), []);
    const closeForm = useCallback(() => {
        setShowForm(false);
        setActivity('');
    }, []);

    if (error) {
        const errorMessage = error.name === "TypeError" && error.message === "Failed to fetch" 
            ? "Check your internet connection" 
            : error.message;
        return <div className="p-[1rem] text-center text-red-500">{errorMessage}</div>;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row p-[1rem] gap-[1rem] h-screen">
            <Navbar1/>
            <Navbar2/>
            {showForm ? 
                <ActivityForm 
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
                        disabled={deleteMutation.isPending}
                    >
                        <i className="fa-solid fa-trash-can"></i>
                        <span>{deleteMutation.isPending ? 'Deleting...' : 'Delete All'}</span>
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
                    <ActivityList 
                        data={data} 
                        selectedId={selectId} 
                        onSelect={selectActivity} 
                        onDelete={deleteSelectedActivity}
                        onUpdate={updateSelectedActivity}
                    />
                </main>
            </div>
            {showMessage ?
                <div className="flex justify-center items-center inset-0 fixed">
                    <Notification message={message} class_name="border border-black p-[0.5rem] text-[1rem] w-[280px]"/>
                </div>
            : null}
        </div>
    );
}