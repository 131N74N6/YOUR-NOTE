import { Request, Response } from 'express';
import { Balances } from '../models/balance.model';

async function deleteAllBalances(_: Request, res: Response) {
    try {
        await Balances.deleteMany();
        res.status(201).json({ message: 'Successfully deleted all balances' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function deleteSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;
        await Balances.deleteOne({ _id: getBalanceById });
        res.status(201).json({ message: 'Successfully deleted one balance' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getAllBalances(_: Request, res: Response) {
    try {
        const balanceList = await Balances.find();
        res.json(balanceList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;
        const getBalance = await Balances.find({ _id: getBalanceById });
        res.json(getBalance);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insertNewBalance(req: Request, res: Response) {
    try {
        const newBalance = new Balances(req.body);
        await newBalance.save();
        res.status(201).json({ message: 'New balance added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function updateSelectedBalance(req: Request, res: Response) {
    try {
        const getBalanceById = req.params.id;
        await Balances.updateOne({ _id: getBalanceById }, { 
            $set: { 
                amount: req.body.editAmount,
                description: req.body.editDescription,
                type: req.body.editType
            } 
        });
        res.status(201).json({ message: 'Successfully updated balance' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export {
    deleteAllBalances,
    deleteSelectedBalance,
    getAllBalances,
    getSelectedBalance,
    insertNewBalance,
    updateSelectedBalance
}