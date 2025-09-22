import mongoose, { Schema, Types } from 'mongoose';

interface IBalance {
    amount: number;
    created_at: string;
    description: string;
    type: 'income' | 'expense';
    user_id: Types.ObjectId;
}

const balanceSchema = new Schema<IBalance>({
    amount: { type: Number, required: true },
    created_at: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
});

const Balances = mongoose.model<IBalance>('balance-list', balanceSchema, 'balance-list');

export { IBalance, Balances };