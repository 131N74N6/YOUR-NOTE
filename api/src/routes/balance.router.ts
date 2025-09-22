import { Router } from 'express';
import { 
    deleteAllBalances, deleteSelectedBalance, getAllBalances, 
    getSelectedBalance, insertNewBalance, updateSelectedBalance 
} from '../controllers/balance.controller';

const balanceRoutes = Router();

balanceRoutes.delete('/:id', deleteSelectedBalance);

balanceRoutes.delete('/', deleteAllBalances);

balanceRoutes.get('/', getAllBalances);

balanceRoutes.get('/:id', getSelectedBalance);

balanceRoutes.post('/', insertNewBalance);

balanceRoutes.put('/:id', updateSelectedBalance);

export default balanceRoutes;