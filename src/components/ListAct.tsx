import { useState } from "react";
import type { ActivityComponentProps } from "../services/custom-types";

export default function ListAct(props: ActivityComponentProps) {
    const [editMode, setEditMode] = useState<boolean>(false);

    const handleSelect = () => {
        setEditMode(true);
        props.onSelect(props.id);
    }

    const closeEditMode = () => {
        setEditMode(false);
    }

    if (editMode) {
        return (
            <div className="border flex flex-col gap-[0.7rem] border-black p-[0.7rem]">
                <div className="font-[550]">{props.act_name}</div>
                <div>{props.created_at.toLocaleString()}</div>
                <div className="flex">
                    <button type="button" className="bg-white text-black text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border border-black w-[85px]" onClick={handleSelect}>Save Changes</button>
                    <button type="button" className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border-0 w-[85px]" onClick={closeEditMode}>Cancel</button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="border flex flex-col gap-[0.7rem] border-black p-[0.7rem]">
                <div className="font-[550]">{props.act_name}</div>
                <div>{props.created_at.toLocaleString()}</div>
                <div className="flex">
                    <button type="button" className="bg-white text-black text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border border-black w-[85px]" onClick={handleSelect}>Select</button>
                    <button type="button" className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border-0 w-[85px]" onClick={() => props.onDelete(props.id)}>Delete</button>
                </div>
            </div>
        );
    }
}