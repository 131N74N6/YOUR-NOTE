import { memo, useState } from "react";
import type { ActivityItemProps } from "../services/custom-types";

function ActivityItem(props: ActivityItemProps) {
    const [editActName, setEditActName] = useState<string>(props.selected_act.activity_name);
    if (props.is_selected) {
        return (
            <form className="border-white border rounded p-[0.45rem] flex flex-col gap-[0.5rem]">
                <input 
                    type="text"
                    placeholder="ex: 4500"
                    value={editActName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditActName(event.target.value)}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
            </form>
        );
    }

    return (
        <div className="border-white border rounded p-[0.45rem] flex flex-col gap-[0.5rem]">
            <div className="flex flex-col gap-[0.3rem]">                                
                <p className="text-white font-[500] text-[0.9rem]">Amount: {props.selected_act.activity_name}</p>
                <p className="text-white font-[500] text-[0.9rem]">Added at: {new Date(props.selected_act.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-[0.7rem]">
                <button 
                    className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" 
                    onClick={() => props.onSelect(props.selected_act.id)}
                >
                    Select
                </button>
                <button 
                    className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" 
                    onClick={() => props.onDelete(props.selected_act.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default memo(ActivityItem);