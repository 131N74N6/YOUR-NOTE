import { Router } from 'express';
import { 
    deleteAllBalances, deleteSelectedBalance, getAllBalances, 
    getSelectedBalance, insertNewBalance, updateSelectedBalance 
} from '../controllers/balance.controller';

const balanceRoutes = Router();

balanceRoutes.delete('/erase-all/:id', deleteAllBalances);

balanceRoutes.delete('/erase/:id', deleteSelectedBalance);

balanceRoutes.get('/get-all/:id', getAllBalances);

balanceRoutes.get('/selected/:id', getSelectedBalance);

balanceRoutes.post('/add', insertNewBalance);

balanceRoutes.put('/change/:id', updateSelectedBalance);

export default balanceRoutes;