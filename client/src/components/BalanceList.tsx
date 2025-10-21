import type { BalanceListProps } from "../services/custom-types";
import BalanceItem from "./BalanceItem";

const BalanceList = (props: BalanceListProps) => {
    if (props.data.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-white font-[600] text-[1rem]">No balance added currently...</span>
            </section>
        );
    }
    
    return (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-[1rem] grid-cols-1 overflow-y-auto">
            {props.data.map((balance) => (
                <BalanceItem
                    key={`blnc_${balance._id}`}
                    isDataChanging={props.isDataChanging}
                    isSelected={props.selectedId === balance._id}
                    selected_data={balance}
                    onDelete={props.onDelete}
                    onSelect={props.onSelect}
                    onUpdate={props.onUpdate}
                />
            ))}
        </div>
    );
}

export default BalanceList;