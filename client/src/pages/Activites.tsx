import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import type { IActivity, UpdateActivityDataProps } from "../services/custom-types";
import useAuth from "../services/useAuth";
import ActivityList from "../components/ActivityList";
import ActivityForm from "../components/ActivityForm";
import Loading from "../components/Loading";
import DataModifier from "../services/data-modifier";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Activites() {
    const { user } = useAuth();
    const { deleteData, getData, insertData, updateData } = DataModifier();
    const queryClient = useQueryClient();

    const [actName, setActName] = useState<string>('');
    const [schedule, setSchedule] = useState<string>('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const { data: actData, isLoading } = getData<IActivity[]>({
        api_url: `http://localhost:1234/activities/get-all/${user?.info.id}`,
        query_key: [`activities-${user?.info.id}`],
        stale_time: 1000
    });

    const changeActMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (selected: UpdateActivityDataProps) => {
            if (!user) return;
            if (!selected.act_name.trim()) throw new Error('Missing required data');
            
            await updateData<IActivity>({
                api_url: `http://localhost:1234/activities/change/${selected._id}`,
                api_data: { act_name: selected.act_name, schedule_at: selected.schedule_at }
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`activities-${user?.info.id}`] }),
        onSettled: () => {
            setIsDataChanging(false);
            setSelectedId(null);
        }
    });

    const insertActMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            const trimmedActName = actName.trim();
            const getCurrentDate = new Date();

            if (!user) return;

            await insertData<IActivity>({
                api_url: 'http://localhost:1234/activities/add',
                api_data: {
                    act_name: trimmedActName,
                    created_at: getCurrentDate.toISOString(),
                    schedule_at: new Date(schedule).toISOString(),
                    user_id: user.info.id
                }
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`activities-${user?.info.id}`] }),
        onSettled: () => {
            setIsDataChanging(false);
            closeForm();
        }
    });

    const deleteOneActMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `http://localhost:1234/activities/erase/${id}` });
            if (selectedId === id) setSelectedId(null);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`activities-${user?.info.id}`] }),
        onSettled: () => setIsDataChanging(false)
    });

    const deleteAllActMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            if (!user) return;
            await deleteData({ api_url: `http://localhost:1234/activities/erase-all/${user.info.id}` });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [`activities-${user?.info.id}`] }),
        onSettled: () => setIsDataChanging(false)
    });

    const saveActName = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        insertActMutation.mutate();
    }

    const handleSelectAct = (id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }

    const deleteSelcetedAct = (id: string): void => {
        deleteOneActMutation.mutate(id);
    }

    const deleteAllAct = (): void => {
        deleteAllActMutation.mutate()
    }

    const updateSelectedAct = (selected: UpdateActivityDataProps) => {
        changeActMutation.mutate(selected);
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
                    isDataChanging={isDataChanging}
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
                        disabled={isDataChanging}
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
                    isDataChanging={isDataChanging}
                />
            </div>
        </main>
    );
}