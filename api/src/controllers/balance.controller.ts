import { Request, Response } from 'express';
import { Balances } from '../models/balance.model';

async function countUserBalance(req: Request, res: Response) {
    try {
        const getUserId = req.params.id;
        const summary = await Balances.aggregate([
            { $match: { user_id: getUserId } },
            { $group: { _id: "$balance_type", income_total: { $sum: "$amount" } } }
        ]);
        
        let incomeTotal = 0;
        let expenseTotal = 0;

        summary.forEach(item => {
            if (item._id === 'income') {
                incomeTotal = item.total;
            } else if (item._id === 'expense') {
                expenseTotal = item.total;
            }
        });

        const balance = incomeTotal - expenseTotal;

        res.json({
            balance: balance,
            income_total: incomeTotal,
            expense_total: expenseTotal,
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
        const balanceList = await Balances.find({ user_id: getUserId });
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