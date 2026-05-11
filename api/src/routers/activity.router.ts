import { Router } from "express";
import { 
    countAllActivities, deleteAllActivities, deleteSelectedActivity, getAllActivities, 
    getSelectedActivity, insertNewActivity, updateSelectedActivity 
} from "../controllers/activity.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const activityRouters = Router();

activityRouters.delete('/erase-all/:user_id', verifyToken, checkOwnership, deleteAllActivities);
activityRouters.delete('/erase/:id', verifyToken, deleteSelectedActivity);

activityRouters.get('/get-all/:user_id', verifyToken, checkOwnership, getAllActivities);
activityRouters.get('/selected/:id', verifyToken, getSelectedActivity);
activityRouters.get('/summary/:user_id', verifyToken, checkOwnership, countAllActivities);

activityRouters.post('/add', verifyToken, insertNewActivity);

activityRouters.put('/change/:id', verifyToken, updateSelectedActivity);

export default activityRouters;