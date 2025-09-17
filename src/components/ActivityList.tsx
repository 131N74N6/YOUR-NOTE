import { memo } from "react";
import type { ActivityListProps } from "../services/custom-types";
import ActivityItem from "./ActivityItem";

function ActivityList(props: ActivityListProps) {
    return (
        <div>
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