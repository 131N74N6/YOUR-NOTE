import { useState } from 'react';

interface BalanceFormProps {
    onSubmit: (data: { amount: number; type: string; description: string }) => void;
    onClose: () => void;
}

const BalanceForm = (props: BalanceFormProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<string>('income');

    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();
        
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) return;
        
        props.onSubmit({ amount: amountValue, type, description: description.trim() || '-' });
    };

    return (
        <form 
        onSubmit={handleSubmit}
        className="fixed inset-0 flex items-center justify-center z-20 bg-[rgba(0,0,0,0.3)]"
        >
            <div className="bg-white border-[2px] flex flex-col gap-[1.3rem] border-black p-[2rem] rounded-lg w-full max-w-md">
                <input
                    type="text"
                    placeholder="Enter balance..."
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-[1.5px] border-black p-[0.45rem] text-[0.95rem] font-mono font-[550] outline-0 text-black"
                />
                
                <input
                    type="text"
                    placeholder="Enter description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-[1.5px] border-black p-[0.45rem] text-[0.95rem] font-mono font-[550] outline-0 text-black"
                />
                
                <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                        <input
                            type="radio"
                            id="income"
                            name="category"
                            value="income"
                            checked={type === 'income'}
                            onChange={() => setType('income')}
                        />
                        <label htmlFor="income" className="text-black">Income</label>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <input
                            type="radio"
                            id="expense"
                            name="category"
                            value="expense"
                            checked={type === 'expense'}
                            onChange={() => setType('expense')}
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

export default BalanceForm;