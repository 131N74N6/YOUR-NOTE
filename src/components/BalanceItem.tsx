import { memo, useState } from 'react';
import type { BalanceItemProps } from '../services/custom-types';

function BalanceItem({ item, isSelected, onSelect, onUpdate, onDelete }: BalanceItemProps) {
    const [editAmount, setEditAmount] = useState(item.amount.toString());
    const [editType, setEditType] = useState(item.type);
    const [editDescription, setEditDescription] = useState(item.description);

    const handleSave = () => {
        const amount = parseFloat(editAmount);
        const trimmedDescription = editDescription.trim();

        if (isNaN(amount) || amount <= 0 || trimmedDescription === '' || !editType) return;

        onUpdate(item.id, { amount, type: editType, description: editDescription });
    };

    const handleCancel = () => {
        setEditAmount(item.amount.toString());
        setEditType(item.type);
        setEditDescription(item.description);
        onSelect(item.id);
    };

    if (isSelected) {
        return (
            <div className="border-[1px] rounded-[1rem] p-[1rem] border-black shadow-[4px_4px_black] flex gap-[1rem] flex-col">
                <input
                    type="text"
                    placeholder="Insert new amount"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="text-black rounded-[0.5rem] border-black font-[600] font-mono border-[1px] outline-0 p-[0.5rem] text-[0.95rem]"
                />
                
                <input
                    type="text"
                    placeholder="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="text-black rounded-[0.5rem] border-black font-[600] font-mono border-[1px] outline-0 p-[0.5rem] text-[0.95rem]"
                />
                
                <div className="flex gap-[1rem] items-center">
                    <div className="type-1 flex items-center gap-1">
                        <input
                            type="radio"
                            id={`income-${item.id}`}
                            name={`amount-type-${item.id}`}
                            value="income"
                            checked={editType === 'income'}
                            onChange={() => setEditType('income')}
                        />
                        <label htmlFor={`income-${item.id}`} className='text-black'>Income</label>
                    </div>
                
                    <div className="flex items-center gap-1">
                        <input
                            type="radio"
                            id={`expense-${item.id}`}
                            name={`amount-type-${item.id}`}
                            value="expense"
                            checked={editType === 'expense'}
                            onChange={() => setEditType('expense')}
                        />
                        <label htmlFor={`expense-${item.id}`} className='text-black'>Expense</label>
                    </div>
                </div>
                
                <div className="button-wrap flex gap-[0.6rem]">
                    <button
                        className="bg-white cursor-pointer p-[0.45rem] font-[550] text-[0.95rem] rounded-[0.45rem] w-[100px] text-black border-[1.5px] border-black"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    
                    <button
                        className="bg-black cursor-pointer p-[0.45rem] font-[550] text-[0.95rem] rounded-[0.45rem] w-[100px] text-white border-0"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="border-[1px] rounded-[1rem] p-[1rem] border-black shadow-[4px_4px_black] flex gap-[1rem] flex-col">
            <div className="text-black">
                Amount: Rp {item.amount.toLocaleString()}
            </div>
            
            <div className="text-black">
                Category: {item.type}
            </div>
            
            <div className="text-black">
                Description: {item.description}
            </div>
            
            <div className="text-black">
                Created at: {new Date(item.created_at).toLocaleString()}
            </div>
        
            <div className="button-wrap flex gap-[0.6rem]">
                <button
                    className="bg-white cursor-pointer p-[0.45rem] font-[550] text-[0.95rem] rounded-[0.45rem] w-[100px] text-black border-[1.5px] border-black"
                    onClick={() => onSelect(item.id)}
                >
                    Select
                </button>
                
                <button
                    className="bg-black cursor-pointer p-[0.45rem] font-[550] text-[0.95rem] rounded-[0.45rem] w-[100px] text-white border-0"
                    onClick={() => onDelete(item.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default memo(BalanceItem);