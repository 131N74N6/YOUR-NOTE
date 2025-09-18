import { memo } from "react";
import type { BalanceListProps } from "../services/custom-types";
import BalanceItem from "./BalanceItem";

const BalanceList = memo((props: BalanceListProps) => {
    if (props.data.length === 0) {
        return (
            <section className="flex flex-col gap-[1rem] p-[1rem] text-[1rem] overflow-y-auto items-center justify-center">
                <span className="text-white font-[600] text-[1rem]">No balance added currently...</span>
            </section>
        );
    }
    
    return (
        <div className="grid md:grid-cols-2 gap-[1rem] grid-cols-1 overflow-y-auto">
            {props.data.map((balance) => (
                <BalanceItem
                    key={`blnc_${balance.id}`}
                    isSelected={props.selectedId === balance.id}
                    selected_data={balance}
                    onDelete={props.onDelete}
                    onSelect={props.onSelect}
                    onUpdate={props.onUpdate}
                />
            ))}
        </div>
    );
});

export default BalanceList;