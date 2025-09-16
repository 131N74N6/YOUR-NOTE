import { useState } from 'react';
import type { BalanceItemProps } from '../services/custom-types';

export default function BalanceItem(props: BalanceItemProps) {
    const [editAmount, setEditAmount] = useState<string>(props.data.amount.toString());
    const [editType, setEditType] = useState(props.data.balance_type);
    const [editDescription, setEditDescription] = useState(props.data.description);

    const handleSave = () => {
        const amount = parseFloat(editAmount);
        if (isNaN(amount) || amount <= 0) alert('Please enter a valid amount');
        return;
    }

    props.onUpdate(props.data.id, {
        amount: Number(editAmount),
        balance_type: editType,
        description: editDescription
    });

    const handleCancel = () => {
        setEditAmount(props.data.amount.toString());
        setEditType(props.data.balance_type);
        setEditDescription(props.data.description);
        props.onSelect(props.data.id);
    }

    if (props.isSelected) {
        return (
            <form onSubmit={handleSave}>
                <input 
                    type="text"
                    placeholder="ex: 4500"
                    value={editAmount}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditAmount(event.target.value)}
                    className="border border-white p-[0.45rem] text-[0.9rem] outline-0"
                />
                <input 
                    type="text"
                    placeholder="ex: buy ice cream"
                    value={editDescription}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditDescription(event.target.value)}
                    className="border border-white p-[0.45rem] text-[0.9rem] outline-0"
                />
                <div className="flex gap-[0.6rem]">
                    <label htmlFor="income">Income</label>
                    <input 
                        type="radio" 
                        id="income" 
                        className="hidden" 
                        onChange={() => setEditType('income')}
                        checked={editType === 'income'}
                    />
                    <label htmlFor="expense">Expense</label>
                    <input 
                        type="radio" 
                        id="expense" 
                        className="hidden" 
                        onChange={() => setEditType('expense')}
                        checked={editType === 'expense'}
                    />
                </div>
                <div className="flex gap-[0.7rem]">
                    <button type="button" className="bg-white cursor-pointer text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]" onClick={handleCancel}>Close</button>
                    <button type="submit" className="bg-white cursor-pointer text-gray-950 p-[0.45rem] rounded-[0.45rem] text-[0.9rem]">Save</button>
                </div>
            </form>
        )
    }

    return (
        <div className="border-white border rounded p-[0.45rem] flex flex-col gap-[0.5rem]">
            <div className="flex flex-col gap-[0.3rem]">                                
                <p className="text-white font-[500] text-[0.9rem]">{props.data.amount}</p>
                <p className="text-white font-[500] text-[0.9rem]">{props.data.description}</p>
                <p className="text-white font-[500] text-[0.9rem]">{props.data.balance_type}</p>
            </div>
            <div className="flex gap-[0.7rem]">
                <button className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.45rem] rounded-[0.45rem] font-[500] text-[0.9rem]">Select</button>
                <button className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.45rem] rounded-[0.45rem] font-[500] text-[0.9rem]" onClick={() => props.onDelete(props.data.id)}>Delete</button>
            </div>
        </div>
    )
}
