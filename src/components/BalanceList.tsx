import type { BalanceListProps } from "../services/custom-types";
import BalanceItem from "./BalanceItem";

export default function BalanceList(props: BalanceListProps) {
    if (props.data.length === 0) {
        return (
            <div>No Balance Added</div>
        );
    }
    
    return (
        <div className="grid md:grid-cols-2 gap-[1rem] grid-cols-1 overflow-y-auto">
            {props.data.map((balance, index) => (
                <BalanceItem
                    key={`${balance.id}_${index}`}
                    isSelected={props.selectedId === balance.id}
                    data={balance}
                    onDelete={props.onDelete}
                    onSelect={props.onSelect}
                    onUpdate={props.onUpdate}
                />
            ))}
        </div>
    );
}