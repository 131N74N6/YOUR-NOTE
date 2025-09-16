import type { BalanceFormProps } from "../services/custom-types";

export default function BalanceForm(props: BalanceFormProps) {
    return (
        <form onSubmit={props.onSave} className="flex justify-center items-center fixed inset-0">
            <div className="bg-[#1a1a1a] p-[1rem] flex flex-col gap-[1rem] border border-white w-[400px] h-[400px]">
                <input 
                    type="text"
                    placeholder="ex: 4500"
                    value={props.amount}
                    onChange={props.changeAmount}
                    className="border border-white p-[0.45rem] text-[0.9rem] outline-0"
                />
                <input 
                    type="text"
                    placeholder="ex: buy ice cream"
                    value={props.description}
                    onChange={props.changeDescription}
                    className="border border-white p-[0.45rem] text-[0.9rem] outline-0"
                />
                <div className="flex gap-[0.6rem]">
                    <label htmlFor="income">Income</label>
                    <input 
                        type="radio" 
                        id="income" 
                        className="hidden" 
                        onChange={props.changeToIncome}
                        checked={props.balance_type === 'income'}
                    />
                    <label htmlFor="expense">Expense</label>
                    <input 
                        type="radio" 
                        id="expense" 
                        className="hidden" 
                        onChange={props.changeToExpense}
                        checked={props.balance_type === 'expense'}
                    />
                </div>
                <div className="flex gap-[0.7rem]">
                    <button type="button" className="bg-white cursor-pointer text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]" onClick={props.onClose}>Close</button>
                    <button type="submit" className="bg-white cursor-pointer text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]">Save</button>
                </div>
            </div>
        </form>
    )
}