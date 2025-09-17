import { memo } from "react";
import type { BalanceFormProps } from "../services/custom-types";

function BalanceForm(props: BalanceFormProps) {
    return (
        <form onSubmit={props.onSave} className="flex justify-center items-center z-20 fixed inset-0 bg-[rgba(0,0,0,0.66)]">
            <div className="p-[1rem] flex flex-col gap-[1rem] border border-white w-[400px] h-[400px]">
                <input 
                    type="text"
                    placeholder="ex: 4500"
                    value={props.amount}
                    onChange={props.changeAmount}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
                <input 
                    type="text"
                    placeholder="ex: buy ice cream"
                    value={props.description}
                    onChange={props.changeDescription}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
                <div className="flex gap-[0.6rem]">
                    <label htmlFor="income" className={`radio-label ${props.balance_type === 'income' ? 'bg-white text-black' : 'text-white'}`}>Income</label>
                    <input 
                        type="radio" 
                        id="income" 
                        className="hidden" 
                        onChange={props.changeToIncome}
                        checked={props.balance_type === 'income'}
                    />
                    <label htmlFor="expense" className={`radio-label ${props.balance_type === 'expense' ? 'bg-white text-black' : 'text-white'}`}>Expense</label>
                    <input 
                        type="radio" 
                        id="expense" 
                        className="hidden" 
                        onChange={props.changeToExpense}
                        checked={props.balance_type === 'expense'}
                    />
                </div>
                <div className="flex gap-[0.7rem]">
                    <button type="button" className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" onClick={props.onClose}>Close</button>
                    <button type="submit" className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]">Save</button>
                </div>
            </div>
        </form>
    );
}

export default memo(BalanceForm);