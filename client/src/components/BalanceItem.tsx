import { memo, useCallback, useEffect, useState } from 'react';
import type { BalanceItemProps } from '../services/custom-types';

const BalanceItem = memo((props: BalanceItemProps) => {
    const [editAmount, setEditAmount] = useState<string>('');
    const [editType, setEditType] = useState<'income' | 'expense'>('income');
    const [editDescription, setEditDescription] = useState<string>('');

    useEffect((): void => {
        if (props.isSelected) {
            setEditAmount(props.selected_data.amount.toString());
            setEditType(props.selected_data.balance_type);
            setEditDescription(props.selected_data.description);
        } 
    }, [props.selected_data, props.isSelected]);

    const handleSave = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();

        await props.onUpdate(props.selected_data.id, {
            amount: Number(editAmount.trim()),
            balance_type: editType,
            description: editDescription.trim()
        });
    }

    const handleCancel = useCallback(() => {
        props.onSelect(props.selected_data.id);
    }, [props.onSelect, props.selected_data.id]);

    if (props.isSelected) {
        return (
            <form onSubmit={handleSave} className="border-white border rounded p-[0.45rem] flex flex-col gap-[0.5rem]">
                <input 
                    type="text"
                    placeholder="ex: 4500"
                    value={editAmount}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditAmount(event.target.value)}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
                <input 
                    type="text"
                    placeholder="ex: buy ice cream"
                    value={editDescription}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditDescription(event.target.value)}
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                />
                <div className="flex gap-[0.6rem]">
                    <label 
                        htmlFor="income" 
                        className={`radio-label ${editType === 'income' ? 'bg-white text-black' : 'text-white'}`}
                    >
                        Income
                    </label>
                    <input 
                        type="radio" 
                        id="income" 
                        className="hidden" 
                        onChange={() => setEditType('income')}
                        checked={editType === 'income'}
                    />
                    <label 
                        htmlFor="expense" 
                        className={`radio-label ${editType === 'expense' ? 'bg-white text-black' : 'text-white'}`}
                    >
                        Expense
                    </label>
                    <input 
                        type="radio" 
                        id="expense" 
                        className="hidden" 
                        onChange={() => setEditType('expense')}
                        checked={editType === 'expense'}
                    />
                </div>
                <div className="flex gap-[0.7rem]">
                    <button 
                        type="button" 
                        className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]" 
                        onClick={handleCancel}
                    >
                        Close
                    </button>
                    <button 
                        type="submit" 
                        className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]"
                    >
                        Save
                    </button>
                </div>
            </form>
        );
    } 
    
    return (
        <div className="border-white border rounded p-[0.45rem] flex flex-col gap-[0.5rem]">
            <div className="flex flex-col gap-[0.3rem]">                                
                <p className="text-white font-[500] text-[0.9rem]">Amount: {props.selected_data.amount}</p>
                <p className="text-white font-[500] text-[0.9rem]">Description: {props.selected_data.description}</p>
                <p className="text-white font-[500] text-[0.9rem]">Type: {props.selected_data.balance_type}</p>
                <p className="text-white font-[500] text-[0.9rem]">Added at: {new Date(props.selected_data.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-[0.7rem]">
                <button 
                    className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" 
                    onClick={() => props.onSelect(props.selected_data.id)}
                >
                    Select
                </button>
                <button 
                    className="bg-white cursor-pointer w-[85px] text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem]" 
                    onClick={() => props.onDelete(props.selected_data.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
});

export default BalanceItem;