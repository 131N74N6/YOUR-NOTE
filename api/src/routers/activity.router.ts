import { Router } from "express";
import { 
    countAllActivities, deleteAllActivities, deleteSelectedActivity, getAllActivities, 
    getSelectedActivity, insertNewActivity, updateSelectedActivity 
} from "../controllers/activity.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const activityRoutes = Router();

// delete all by user id
activityRoutes.delete('/erase-all/:id', verifyToken, checkOwnership, deleteAllActivities);

activityRoutes.delete('/erase/:id', verifyToken, deleteSelectedActivity);

// get all by user id
activityRoutes.get('/get-all/:id', verifyToken, checkOwnership, getAllActivities);

activityRoutes.get('/selected/:id', verifyToken, getSelectedActivity);

activityRoutes.get('/summary/:id', verifyToken, checkOwnership, countAllActivities);

activityRoutes.post('/add', verifyToken, insertNewActivity);

activityRoutes.put('/change/:id', verifyToken, updateSelectedActivity);

export default activityRoutes;