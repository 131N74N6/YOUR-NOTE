import { Router } from 'express';
import { 
    countUserBalance,
    deleteAllBalances, deleteSelectedBalance, getAllBalances, 
    getSelectedBalance, insertNewBalance, updateSelectedBalance 
} from '../controllers/balance.controller';
import { checkOwnership, verifyToken } from '../middleware/auth.middleware';

const balanceRoutes = Router();

balanceRoutes.delete('/erase-all/:id', verifyToken, checkOwnership, deleteAllBalances);

balanceRoutes.delete('/erase/:id', verifyToken, deleteSelectedBalance);

balanceRoutes.get('/get-all/:id', verifyToken, checkOwnership, getAllBalances);

balanceRoutes.get('/selected/:id', verifyToken, getSelectedBalance);

balanceRoutes.get('/summary/:id', verifyToken, checkOwnership, countUserBalance);

balanceRoutes.post('/add', verifyToken, insertNewBalance);

balanceRoutes.put('/change/:id', verifyToken, updateSelectedBalance);

export default balanceRoutes;