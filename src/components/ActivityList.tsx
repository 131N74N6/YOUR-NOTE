import { memo } from "react";
import type { ActivityListProps } from "../services/custom-types";
import ActivityItem from "./ActivityItem";

function ActivityList(props: ActivityListProps) {
    if (props.act_data.length === 0) {
        return (
            <section className="flex flex-col gap-[1rem] p-[1rem] text-[1rem] overflow-y-auto items-center justify-center">
                <span className="text-white font-[600] text-[1rem]">No Activity Added...</span>
            </section>
        );
    }

    return (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[0.7rem] overflow-y-auto">
            {props.act_data.map((act, index) => (
                <ActivityItem
                    is_selected={props.selectedId === act.id}
                    onDelete={props.onDelete}
                    onSelect={props.onSelect}
                    onUpdate={props.onUpdate}
                    selected_act={act}
                    key={`${act.id}_${index}`}
                />
            ))}
        </div>
    );
}

export default memo(ActivityList);