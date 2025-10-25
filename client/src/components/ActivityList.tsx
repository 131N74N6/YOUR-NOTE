import type { ActivityListProps } from "../services/custom-types";
import ActivityItem from "./ActivityItem";
import Loading from "./Loading";

function ActivityList(props: ActivityListProps) {
    if (props.act_datas.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-white font-[600] text-[1rem]">No activity added currently...</span>
            </section>
        );
    }

    return (
        <div className="flex flex-col overflow-y-auto gap-[1rem]">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-[0.7rem]">
                {props.act_datas.map((act) => (
                    <ActivityItem
                        key={`act_${act._id}`}
                        is_selected={props.selectedId === act._id}
                        isDataChanging={props.isDataChanging}
                        onDelete={props.onDelete}
                        onSelect={props.onSelect}
                        onUpdate={props.onUpdate}
                        selected_act={act}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.isLoadMore ? <Loading/> : null}
                {props.isReachedEnd && props.act_datas.length > 0 ? (
                    <p className="text-white font-[500] text-center text-[1rem]">No More Data to Show</p>
                ) : (
                    <button 
                        type="button"
                        onClick={() => props.getMore()}
                        className="bg-white text-gray-800 w-[120px] rounded font-[500] cursor-pointer p-[0.4rem] text-[0.9rem]"
                    >
                        Load More
                    </button> 
                )}
            </div>
        </div>
    );
}

export default ActivityList;