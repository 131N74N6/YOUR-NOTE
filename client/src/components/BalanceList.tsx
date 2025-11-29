import type { BalanceListProps } from "../services/custom-types";
import BalanceItem from "./BalanceItem";
import Loading from "./Loading";

const BalanceList = (props: BalanceListProps) => {
    if (props.balances.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-white font-[600] text-[1rem]">No balance found...</span>
            </section>
        );
    }
    
    return (
        <div className="flex flex-col gap-[1rem] overflow-y-auto">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-[1rem] grid-cols-1">
                {props.balances.map((balance) => (
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
            <div className="flex justify-center">
                {props.isLoadMore ? <Loading/> : null}
                {props.balances.length < 12 ? (
                    <></>
                ) : props.isReachedEnd && props.balances.length > 0 ? (
                    <p className="text-white font-[500] text-center text-[1rem]">No More Data to Show</p>
                ) : (
                    <button 
                        type="button"
                        onClick={() => props.getMore()}
                        className="bg-white text-gray-800 w-[120px] rounded font-[500] cursor-pointer p-[0.4rem] text-[0.9rem]"
                    >
                        Load More
                    </button> 
                )}
            </div>
        </div>
    );
}

export default BalanceList;