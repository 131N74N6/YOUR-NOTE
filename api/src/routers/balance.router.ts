import { Router } from 'express';
import { 
    countUserBalance,
    deleteAllBalances, deleteSelectedBalance, getAllBalances, 
    getSelectedBalance, insertNewBalance, updateSelectedBalance 
} from '../controllers/balance.controller';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';

const balanceRouters = Router();

balanceRouters.delete('/erase-all/:user_id', verifyToken, checkOwnership, deleteAllBalances);
balanceRouters.delete('/erase/:id', verifyToken, deleteSelectedBalance);

balanceRouters.get('/get-all/:user_id', verifyToken, checkOwnership, getAllBalances);
balanceRouters.get('/selected/:id', verifyToken, getSelectedBalance)
balanceRouters.get('/summary/:user_id', verifyToken, checkOwnership, countUserBalance);

balanceRouters.post('/add', verifyToken, insertNewBalance);

balanceRouters.put('/change/:id', verifyToken, updateSelectedBalance);

export default balanceRouters;