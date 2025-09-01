import { memo, useState } from "react";
import type { ActivityItemProps } from "../services/custom-types";

const ActivityItem = memo((props: ActivityItemProps) => {
    const [newActivity, setNewActivity] = useState<string>(props.detail.act_name);

    function handleSave(event: React.FormEvent): void {
        event.preventDefault();
        const trimmedNewActivity = newActivity.trim();
        props.onUpdate(props.detail.id, trimmedNewActivity);
    }
    
    function closeEditMode(): void {
        setNewActivity(props.detail.act_name);
        props.onSelect(props.detail.id);
    }

    if (props.isSelected) {
        return (
            <div className="border flex flex-col gap-[0.7rem] border-black p-[0.7rem]">
                <input 
                    type="text"
                    placeholder="your goals"
                    value={newActivity}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewActivity(event.target.value)}
                    className="font-[550] border border-black p-[0.4rem] text-[0.9rem]" 
                />
                <div>{`${props.detail.created_at.toLocaleString()}`}</div>
                <div className="flex">
                    <button 
                        type="submit" 
                        onClick={handleSave}
                        className="bg-white text-black text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border border-black w-[85px]"
                    >
                        <i className="fa-solid fa-check"></i>
                    </button>
                    <button 
                        type="button" 
                        className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border-0 w-[85px]" 
                        onClick={closeEditMode}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        );
    } 

    return (
        <div className="border flex flex-col gap-[0.7rem] border-black p-[0.7rem]">
            <div className="font-[550]">{props.detail.act_name}</div>
            <div>{`${props.detail.created_at.toLocaleString()}`}</div>
            <div className="flex">
                <button 
                    type="button" 
                    className="bg-white text-black text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border border-black w-[85px]" 
                    onClick={() => props.onSelect(props.detail.id)}
                >
                    <i className="fa-solid fa-pen-nib"></i>
                </button>
                <button 
                    type="button" 
                    className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border-0 w-[85px]" 
                    onClick={() => props.onDelete(props.detail.id)}
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    );
});

export default ActivityItem;