import { memo, useCallback, useEffect, useState } from "react";
import type { ActivityItemProps } from "../services/custom-types";

const ActivityItem = memo((props: ActivityItemProps) => {
    const [editActName, setEditActName] = useState<string>('');
    const [editSchedule, setEditSchedule] = useState<string>('');

    const isoToLocalDateTime = useCallback((isoString: string): string => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }, []);

    useEffect((): void => {
        if (props.is_selected) {            
            setEditActName(props.selected_act.act_name);
            setEditSchedule(isoToLocalDateTime(props.selected_act.schedule_at));
        } else {
            setEditActName('');
            setEditSchedule('');
        }
    }, [props.is_selected, props.selected_act]);

    const handleSave = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        
        await props.onUpdate(props.selected_act._id, {
            act_name: editActName.trim(),
            schedule_at: new Date(editSchedule).toISOString(),
        });
    }

    const handleCancel = useCallback((): void => {
        props.onSelect(props.selected_act._id);
    }, [props.onSelect, props.selected_act._id]);

    if (props.is_selected) {
        return (
            <form onSubmit={handleSave} className="border-white border rounded p-[0.45rem] flex flex-col gap-[0.5rem]">
                <input 
                    type="text"
                    placeholder="ex: watch movie"
                    value={editActName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditActName(event.target.value)}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
                <input 
                    type="datetime-local"
                    placeholder="ex: 4500"
                    value={editSchedule}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditSchedule(event.target.value)}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
                <div className="flex gap-[0.7rem]">
                    <button type="submit" className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]">Save</button>
                    <button type="button" className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        );
    } 
    
    return (
        <div className="border-white border rounded p-[0.45rem] flex flex-col gap-[0.5rem]">
            <div className="flex flex-col gap-[0.3rem]">                                
                <p className="text-white font-[500] text-[0.9rem]">Act: {props.selected_act.act_name}</p>
                <p className="text-white font-[500] text-[0.9rem]">Schedule: {new Date(props.selected_act.schedule_at).toLocaleString()}</p>
                <p className="text-white font-[500] text-[0.9rem]">Added at: {new Date(props.selected_act.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-[0.7rem]">
                <button 
                    className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" 
                    onClick={() => props.onSelect(props.selected_act._id)}
                >
                    Select
                </button>
                <button 
                    className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" 
                    onClick={() => props.onDelete(props.selected_act._id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
});

export default ActivityItem;