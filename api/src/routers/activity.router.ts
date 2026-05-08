import { Router } from "express";
import { 
    countAllActivities, deleteAllActivities, deleteSelectedActivity, getAllActivities, 
    getSelectedActivity, insertNewActivity, updateSelectedActivity 
} from "../controllers/activity.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const activityRoutes = Router();

activityRoutes.delete('/erase-all/:user_id', verifyToken, checkOwnership, deleteAllActivities);
activityRoutes.delete('/erase/:id', verifyToken, deleteSelectedActivity);

activityRoutes.get('/get-all/:user_id', verifyToken, checkOwnership, getAllActivities);
activityRoutes.get('/selected/:id', verifyToken, getSelectedActivity);
activityRoutes.get('/summary/:user_id', verifyToken, checkOwnership, countAllActivities);

activityRoutes.post('/add', verifyToken, insertNewActivity);

activityRoutes.put('/change/:id', verifyToken, updateSelectedActivity);

export default activityRoutes;