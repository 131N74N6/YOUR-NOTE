import type { ActivityComponentProps } from "../services/custom-types";

export default function ListAct(props: ActivityComponentProps) {
    return (
        <div className="border-[1px] border-black p-[1rem]">
            <h3>{props.act_name}</h3>
            <p>{props.created_at.toLocaleString()}</p>
            <div className="flex gap-[0.7rem]">
                <button type="button" onClick={() => props.onSelect(props.id)}>Select</button>
                <button type="button" onClick={() => props.onDelete(props.id)}>Delete</button>
            </div>
        </div>
    );
}