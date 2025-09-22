import { Router } from "express";
import { 
    deleteAllActivities, deleteSelectedActivity, getAllActivities, 
    getSelectedActivity, insertNewActivity, updateSelectedActivity 
} from "../controllers/activity.controller";

const activityRoutes = Router();

activityRoutes.delete('/', deleteAllActivities);

activityRoutes.delete('/:id', deleteSelectedActivity);

activityRoutes.get('/', getAllActivities);

activityRoutes.get('/:id', getSelectedActivity);

activityRoutes.post('/', insertNewActivity);

activityRoutes.put('/:id', updateSelectedActivity);

export default activityRoutes;