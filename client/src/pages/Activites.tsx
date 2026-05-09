import { useEffect, useState } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import type { IActivity, UpdateActivityDataProps } from "../services/custom-types";
import useAuth from "../services/auth-services";
import ActivityList from "../components/ActivityList";
import ActivityForm from "../components/ActivityForm";
import Loading from "../components/Loading";
import DataModifier from "../services/data-services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Notification from "../components/Notification";

export default function Activites() {
    const { currentUserId } = useAuth();
    const { deleteData, infiniteScroll, insertData, message, setMessage, updateData } = DataModifier();
    const queryClient = useQueryClient();

    const [actName, setActName] = useState<string>('');
    const [schedule, setSchedule] = useState<string>('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isDataChanging, setIsDataChanging] = useState<boolean>(false);

    const { 
        paginatedData: actData, 
        error,
        fetchNextPage,
        isFetchingNextPage,
        isLoading, 
        isReachedEnd 
    } = infiniteScroll<IActivity>({
        api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/get-all/${currentUserId}`,
        query_key: [`activities-${currentUserId}`],
        stale_time: 1800000,
        limit: 12
    });

    const changeActMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (selected: UpdateActivityDataProps) => {
            await updateData<IActivity>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/change/${selected._id}`,
                api_data: { act_name: selected.act_name, schedule_at: selected.schedule_at }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`activities-${currentUserId}`] });
        },
        onSettled: () => {
            setIsDataChanging(false);
            setSelectedId(null);
        }
    });

    const insertActMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            await insertData<IActivity>({
                api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/add`,
                api_data: {
                    act_name: actName.trim(),
                    created_at: new Date().toISOString(),
                    schedule_at: new Date(schedule).toISOString(),
                    user_id: currentUserId
                }
            });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`activities-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`act-total-${currentUserId}`] });
        },
        onSettled: () => {
            setIsDataChanging(false);
            closeForm();
        }
    });

    const deleteOneActMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async (id: string) => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/erase/${id}` });
            if (selectedId === id) setSelectedId(null);
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`activities-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`act-total-${currentUserId}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const deleteAllActMutation = useMutation({
        onMutate: () => setIsDataChanging(true),
        mutationFn: async () => {
            await deleteData({ api_url: `${import.meta.env.VITE_BASE_API_URL}/activities/erase-all/${currentUserId}` });
        },
        onError: () => {},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`activities-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`act-total-${currentUserId}`] });
        },
        onSettled: () => setIsDataChanging(false)
    });

    const saveActName = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        insertActMutation.mutate();
    }

    const handleSelectAct = (id: string): void => {
        setSelectedId(prev => prev === id ? null : id);
    }

    const closeForm = (): void => {
        setActName('');
        setSchedule('');
        setOpenForm(false);
    }

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect((): void => {
        if (!currentUserId) {
            closeForm();
            setSelectedId(null);
            setMessage(null);
        }
    }, [currentUserId, closeForm]);

    return (
        <main className="h-screen flex md:flex-row flex-col gap-[1rem] p-[1rem] bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')] relative z-10">
            <Navbar1/>
            <Navbar2/>
            {openForm ? (
                <ActivityForm
                    act_name={actName}
                    changeActName={(event: React.ChangeEvent<HTMLInputElement>) => setActName(event.target.value)}
                    schedule_at={schedule}
                    makeSchedule={(event: React.ChangeEvent<HTMLInputElement>) => setSchedule(event.target.value)}
                    onClose={closeForm}
                    onSave={saveActName}
                    isDataChanging={isDataChanging}
                />
            ) : null}
            {message ? Notification(message) : null}
            <div className="flex flex-col h-full gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-white font-[600] text-[1rem]">{error.message || 'Failed to load your activities. Try again later.'}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-[0.7rem] overflow-y-auto">
                            <button 
                                onClick={() => setOpenForm(true)}
                                type="button" 
                                className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                            >
                                Add Activity
                            </button>
                            <button 
                                onClick={() => deleteAllActMutation.mutate()}
                                type="button" 
                                disabled={isDataChanging}
                                className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]"
                            >
                                Delete All Activities
                            </button>
                        </div>
                        <ActivityList
                            act_datas={actData ? actData : []}
                            getMore={fetchNextPage}
                            isDataChanging={isDataChanging}
                            isLoadMore={isFetchingNextPage}
                            isReachedEnd={isReachedEnd}
                            onDelete={(id) => deleteOneActMutation.mutate(id)}
                            onSelect={handleSelectAct}
                            onUpdate={(activity) => changeActMutation.mutate(activity)}
                            selectedId={selectedId}
                        />
                    </>
                )}
            </div>
        </main>
    );
}