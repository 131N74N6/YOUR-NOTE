import { Request, Response } from 'express';
import { Balances } from '../models/balance.model';
import { Types } from 'mongoose';

export async function countUserBalance(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const incomeResult = await Balances.aggregate([
            { $match: { $and: [{ user_id: new Types.ObjectId(getUserId) }, { balance_type: 'income' }] } },
            { $group: { _id: "income", total: { $sum: "$amount" } } }
        ]);
        
        const expenseResult = await Balances.aggregate([
            { $match: { $and: [{ user_id: new Types.ObjectId(getUserId) }, { balance_type: 'expense' }] } },
            { $group: { _id: 'expense', total: { $sum: '$amount' } } }
        ]);

        const incomeTotal = incomeResult.length > 0 ? incomeResult[0].total : 0;
        const expenseTotal = expenseResult.length > 0 ? expenseResult[0].total : 0;
        const currentBalance = incomeTotal - expenseTotal;

        res.status(200).json({
            expense: expenseTotal,
            income: incomeTotal,
            balance: currentBalance
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllBalances(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const balanceList = await Balances.find({ user_id: getUserId });
        if (balanceList.length === 0) return res.status(400).json({ message: 'No balance to delete' });

        await Balances.deleteMany({ user_id: getUserId });
        res.status(200).json({ message: 'Successfully deleted all balances' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;
        await Balances.deleteOne({ _id: getBalanceById });
        res.status(200).json({ message: 'Successfully deleted one balance' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getAllBalances(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const limit = parseInt(req.query.limit as string) || 12;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        const balanceList = await Balances.find({ user_id: getUserId }).limit(limit).skip(skip);
        res.status(200).json(balanceList);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;
        const getBalance = await Balances.find({ _id: getBalanceById });
        res.status(200).json(getBalance);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function insertNewBalance(req: Request, res: Response) {
    try {
        const newBalance = new Balances(req.body);

        if (!newBalance.amount && !newBalance.balance_type && !newBalance.description) return res.status(400).json({ message: 'Amount, balance type, and description are required' });
        if (!newBalance.amount) return res.status(400).json({ message: 'Amount is required' });
        if (!newBalance.balance_type) return res.status(400).json({ message: 'Balance type is required' });
        if (!newBalance.description) return res.status(400).json({ message: 'Description is required' });
        
        await newBalance.save();
        res.status(200).json({ message: 'New balance added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function updateSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;

        if (!req.body.amount) return res.status(400).json({ message: 'Amount is required' });
        if (!req.body.balance_type) return res.status(400).json({ message: 'Balance type is required' });
        if (!req.body.description) return res.status(400).json({ message: 'Description is required' });

        await Balances.updateOne({ _id: getBalanceById }, { 
            $set: { 
                amount: req.body.amount,
                balance_type: req.body.balance_type,
                description: req.body.description
            } 
        });
        res.status(200).json({ message: 'Successfully updated balance' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}