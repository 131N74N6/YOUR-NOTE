import { memo } from "react";
import type { ActivityListProps } from "../services/custom-types";
import ActivityItem from "./ActivityItem";

const ActivityList = memo((props: ActivityListProps) => {
    return (
        <>
            {props.data.length > 0 ? props.data.map((act) => (
                <ActivityItem 
                    key={`act_${act.id}`}
                    detail={act} 
                    isSelected={props.selectedId === act.id} 
                    onCancel={props.onCancel}
                    onDelete={props.onDelete} 
                    onSelect={props.onSelect}
                    newActivity={props.newActivity}
                    onUpdate={props.onUpdate}
                    onEditActivityChange={props.onEditActivityChange}
                />
            )): <div className="flex justify-center items-center h-screen">
                <span className="text-red-600 font-[600] text-[1.3rem]">No activity added currently...</span>
            </div>}
        </>
    )
});

export default ActivityList;