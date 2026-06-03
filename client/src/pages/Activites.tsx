import { useEffect } from "react";
import { Navbar1, Navbar2 } from "../components/Navbar";
import ActivityList from "../components/ActivityList";
import ActivityForm from "../components/ActivityForm";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import ActivityServices from "../services/activity.service";

export default function Activites() {
    const { allActivities, actName, changeActMutation, currentUserId, closeForm, deleteAllActMutation, deleteOneActMutation, 
        handleSelectAct, isProcessing, message, openForm, saveActName, schedule, selectedId, setActName, setSchedule, setOpenForm, 
        setSelectedId, setMessage 
    } = ActivityServices();

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
                    isDataChanging={isProcessing}
                />
            ) : null}
            {message ? Notification(message) : null}
            <div className="flex flex-col h-full min-h-[200px] gap-[1rem] md:w-3/4 w-full p-[1rem] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75">
                <div className="flex gap-[0.7rem]">
                    <button 
                        onClick={() => setOpenForm(true)}
                        type="button" 
                        disabled={isProcessing || allActivities.isLoading}
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem] disabled:cursor-not-allowed"
                    >
                        Add Activity
                    </button>
                    <button 
                        onClick={() => deleteAllActMutation.mutate()}
                        type="button" 
                        disabled={isProcessing || allActivities.isLoading}
                        className="bg-white cursor-pointer font-[500] text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem] disabled:cursor-not-allowed"
                    >
                        Delete All Activities
                    </button>
                </div>
                {allActivities.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : allActivities.error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-white font-[600] text-[1rem]">{allActivities.error.message || 'Failed to load your activities. Try again later.'}</p>
                    </div>
                ) : (
                    <ActivityList
                        act_datas={allActivities.paginatedData ? allActivities.paginatedData : []}
                        getMore={allActivities.fetchNextPage}
                        isDataChanging={isProcessing}
                        isLoadMore={allActivities.isFetchingNextPage}
                        isReachedEnd={allActivities.isReachedEnd}
                        onDelete={deleteOneActMutation}
                        onSelect={handleSelectAct}
                        onUpdate={changeActMutation}
                        selectedId={selectedId}
                    />
                )}
            </div>
        </main>
    );
}