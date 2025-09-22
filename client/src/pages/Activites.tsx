import { useCallback, useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import useFirestore from "../services/useApiCalls";
import type { IActivity } from "../services/custom-types";
import useAuth from "../services/useAuth";
import ActivityList from "../components/ActivityList";
import ActivityForm from "../components/ActivityForm";
import Loading from "../components/Loading";

export default function Activites() {
    const collectionName = 'activities';
    const [actName, setActName] = useState<string>('');
    const [schedule, setSchedule] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { user } = useAuth();

    const { deleteData, insertData, realTimeInit, updateData } = useFirestore<IActivity>();
    const { data: actData, loading } = realTimeInit({
        collection_name: collectionName,
        filters: user ? [['user_id', '==', user.uid]] : [],
        order_by_options: [['created_at', 'desc']]
    })

    const saveActName = useCallback(async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const trimmedActName = actName.trim();

        if (!user) return;
        if (!trimmedActName || !schedule) throw new Error('Missing required data');

        await insertData({
            collection_name: collectionName,
            new_data: {
                activity_name: trimmedActName,
                schedule: new Date(schedule).toISOString(),
                user_id: user.uid
            }
        });
        closeForm();
    }, [user, actName, schedule, insertData]);

    const handleSelectAct = useCallback((id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }, []);

    const deleteSelcetedAct = useCallback(async (id: string): Promise<void> => {
        await deleteData({
            collection_name: collectionName,
            values: id
        });
    }, []);

    const deleteAllAct = useCallback(async (): Promise<void> => {
        await deleteData({
            collection_name: collectionName,
            filters: [['user_id', '==', user?.uid]]
        });
    }, [actData, user]);

    const updateSelectedAct = useCallback(async (id: string, changeAct: {
        activity_name: string;
        schedule: string;
    }): Promise<void> => {
        try {
            if (!changeAct.activity_name.trim()) throw new Error('Missing required data');
            
            await updateData({
                collection_name: collectionName,
                new_data: changeAct,
                values: id
            });
        } catch (error: any) {
            console.error(error.message);
        } finally {
            setSelectedId(null);
        }
    }, []);

    const closeForm = useCallback((): void => {
        setActName('');
        setSchedule('');
        setOpenForm(false);
    }, []);
    
    useEffect((): void => {
        if (!user) {
            closeForm();
            setSelectedId(null);
        }
    }, [user, closeForm]);

    if (loading) return <Loading/>

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            {openForm ? 
                <ActivityForm
                    act_name={actName}
                    changeActName={(event: React.ChangeEvent<HTMLInputElement>) => setActName(event.target.value)}
                    schedule={schedule}
                    makeSchedule={(event: React.ChangeEvent<HTMLInputElement>) => setSchedule(event.target.value)}
                    onClose={closeForm}
                    onSave={saveActName}
                />
            : null}
            <div className="flex flex-col gap-[1rem] md:w-3/4 w-full p-[1rem] h-[90%] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="flex gap-[0.7rem]">
                    <button 
                        onClick={() => setOpenForm(true)}
                        type="button" 
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Add Activity
                    </button>
                    <button 
                        onClick={deleteAllAct}
                        type="button" 
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                    >
                        Delete All Activities
                    </button>
                </div>
                <ActivityList
                    act_data={actData}
                    onDelete={deleteSelcetedAct}
                    onSelect={handleSelectAct}
                    onUpdate={updateSelectedAct}
                    selectedId={selectedId}
                />
            </div>
        </main>
    );
}
