import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import useApiCalls from "../services/data-modifier";
import type { IActivity } from "../services/custom-types";
import useAuth from "../services/useAuth";
import ActivityList from "../components/ActivityList";
import ActivityForm from "../components/ActivityForm";
import Loading from "../components/Loading";
import useSWR from "swr";

export default function Activites() {
    const [actName, setActName] = useState<string>('');
    const [schedule, setSchedule] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { user } = useAuth();

    const { deleteData, getData, insertData, updateData } = useApiCalls<IActivity>();

    const { data: actData, isLoading, mutate } = useSWR<IActivity[]>(
        user ? `http://localhost:1234/activities/get-all/${user.info.id}` : null, 
        getData, 
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 5000, // Reduce unnecessary requests
            errorRetryCount: 3,
        }
    );

    const saveActName = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        const trimmedActName = actName.trim();
        const getCurrentDate = new Date();

        if (!user) return;

        await insertData({
            api_url: 'http://localhost:1234/activities/add',
            api_data: {
                act_name: trimmedActName,
                created_at: getCurrentDate.toISOString(),
                schedule_at: new Date(schedule).toISOString(),
                user_id: user.info.id
            }
        });

        mutate();
        closeForm();
    }

    const handleSelectAct = (id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }

    const deleteSelcetedAct = async (id: string): Promise<void> => {
        if (!user) return;
        await deleteData({ api_url: `http://localhost:1234/activities/erase/${id}` });
        mutate();
        if (selectedId === id) setSelectedId(null);
    }

    const deleteAllAct = async (): Promise<void> => {
        if (!user) return;
        await deleteData({ api_url: `http://localhost:1234/activities/erase-all/${user.info.id}` });
        mutate();
    }

    const updateSelectedAct = async (id: string, changeAct: {
        act_name: string;
        schedule_at: string;
    }): Promise<void> => {
        if (!user) return;
        try {
            if (!changeAct.act_name.trim()) throw new Error('Missing required data');
            
            await updateData({
                api_url: `http://localhost:1234/activities/change/${id}`,
                api_data: changeAct
            });
        } catch (error: any) {
            console.error(error.message);
        } finally {
            mutate();
            setSelectedId(null);
        }
    }

    const closeForm = (): void => {
        setActName('');
        setSchedule('');
        setOpenForm(false);
    }
    
    useEffect((): void => {
        if (!user) {
            closeForm();
            setSelectedId(null);
        }
    }, [user, closeForm]);

    if (isLoading) return <Loading/>

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            {openForm ? 
                <ActivityForm
                    act_name={actName}
                    changeActName={(event: React.ChangeEvent<HTMLInputElement>) => setActName(event.target.value)}
                    schedule_at={schedule}
                    makeSchedule={(event: React.ChangeEvent<HTMLInputElement>) => setSchedule(event.target.value)}
                    onClose={closeForm}
                    onSave={saveActName}
                />
            : null}
            <div className="flex flex-col min-h-[500px] gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
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
                    act_data={actData ? actData : []}
                    onDelete={deleteSelcetedAct}
                    onSelect={handleSelectAct}
                    onUpdate={updateSelectedAct}
                    selectedId={selectedId}
                />
            </div>
        </main>
    );
}