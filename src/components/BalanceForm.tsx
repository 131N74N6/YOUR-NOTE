import { memo } from 'react';
import type { BalanceFormProps } from '../services/custom-types';

function BalanceForm(props: BalanceFormProps) {
    return (
        <form 
            onSubmit={props.onSend}
            className="fixed inset-0 flex items-center justify-center z-20 bg-[rgba(0,0,0,0.3)]"
        >
            <div className="bg-white border-[2px] flex flex-col gap-[1.3rem] border-black p-[2rem] rounded-lg w-full max-w-md">
                <input
                    type="text"
                    placeholder="Enter balance..."
                    value={props.amount}
                    onChange={props.onChangeAmount}
                    className="border-[1.5px] border-black p-[0.45rem] text-[0.95rem] font-mono font-[550] outline-0 text-black"
                />
                
                <input
                    type="text"
                    placeholder="Enter description..."
                    value={props.description}
                    onChange={props.onChangeDescription}
                    className="border-[1.5px] border-black p-[0.45rem] text-[0.95rem] font-mono font-[550] outline-0 text-black"
                />
                
                <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                        <input
                            type="radio"
                            id="income"
                            name="category"
                            value="income"
                            checked={props.type === 'income'}
                            onChange={props.onPickIncome}
                        />
                        <label htmlFor="income" className="text-black">Income</label>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <input
                            type="radio"
                            id="expense"
                            name="category"
                            value="expense"
                            checked={props.type === 'expense'}
                            onChange={props.onPickExpense}
                        />
                        <label htmlFor="expense" className="text-black">Expense</label>
                    </div>
                </div>
                
                <div className="flex gap-[1rem]">
                    <button
                        type="submit"
                        className="bg-white border-[1px] border-black text-black cursor-pointer w-[90px] shadow-[4px_4px_black] p-[0.45rem] text-[0.95rem] font-mono font-[550]"
                    >
                        Add
                    </button>
                    
                    <button
                        type="button"
                        onClick={props.onClose}
                        className="bg-white border-[1px] border-black text-black cursor-pointer w-[90px] shadow-[4px_4px_black] p-[0.45rem] text-[0.95rem] font-mono font-[550]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </form>
    );
}

export default memo(BalanceForm);