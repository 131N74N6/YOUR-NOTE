import { Request, Response } from 'express';
import { Balances } from '../models/balance.model';
import { Types } from 'mongoose';

async function countUserBalance(req: Request, res: Response) {
    try {
        const getUserId = req.params.id;
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

        res.json({
            expense: expenseTotal,
            income: incomeTotal,
            balance: currentBalance
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function deleteAllBalances(req: Request, res: Response) {
    try {
        const getUserId = req.params.id;
        await Balances.deleteMany({ user_id: getUserId });
        res.status(201).json({ message: 'Successfully deleted all balances' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function deleteSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;
        await Balances.deleteOne({ _id: getBalanceById });
        res.status(201).json({ message: 'Successfully deleted one balance' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function getAllBalances(req: Request, res: Response) {
    try {
        const getUserId = req.params.id;
        const limit = parseInt(req.query.limit as string) || 12;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        const balanceList = await Balances.find({ user_id: getUserId }).limit(limit).skip(skip);
        res.json(balanceList);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function getSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;
        const getBalance = await Balances.find({ _id: getBalanceById });
        res.json(getBalance);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function insertNewBalance(req: Request, res: Response) {
    try {
        const newBalance = new Balances(req.body);
        await newBalance.save();
        res.status(201).json({ message: 'New balance added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

async function updateSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;
        await Balances.updateOne({ _id: getBalanceById }, { 
            $set: { 
                amount: req.body.amount,
                balance_type: req.body.balance_type,
                description: req.body.description
            } 
        });
        res.status(201).json({ message: 'Successfully updated balance' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export {
    countUserBalance,
    deleteAllBalances,
    deleteSelectedBalance,
    getAllBalances,
    getSelectedBalance,
    insertNewBalance,
    updateSelectedBalance
}