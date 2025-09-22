import { Router } from "express";
import { 
    deleteAllActivities, deleteSelectedActivity, getAllActivities, 
    getSelectedActivity, insertNewActivity, updateSelectedActivity 
} from "../controllers/activity.controller";

const activityRoutes = Router();

// delete all by user id
activityRoutes.delete('/erase-all/:id', deleteAllActivities);

activityRoutes.delete('/erase/:id', deleteSelectedActivity);

// get all by user id
activityRoutes.get('/get-all/:id', getAllActivities);

activityRoutes.get('/selected/:id', getSelectedActivity);

activityRoutes.post('/add', insertNewActivity);

activityRoutes.put('/change/:id', updateSelectedActivity);

export default activityRoutes;