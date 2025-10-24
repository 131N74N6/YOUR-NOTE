import { Request, Response } from "express";
import { Activity } from "../models/activity.model";

async function countAllActivities(req: Request, res: Response): Promise<void> {
    try {
        const getUserId = req.params.id;
        const activityList = await Activity.find({ user_id: getUserId }).countDocuments();
        res.json(activityList);
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
    }
}

async function deleteAllActivities(req: Request, res: Response): Promise<void> {
    try {
        const getUserId = req.params.id;
        await Activity.deleteMany({ user_id: getUserId });
        res.status(201).json({ message: 'Successfully deleted all' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function deleteSelectedActivity(req: Request, res: Response): Promise<void> {
    try {
        const getActId = req.params.id;
        await Activity.deleteOne({ _id: getActId });
        res.status(201).json({ message: 'Successfully deleted one activity' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getAllActivities(req: Request, res: Response): Promise<void> {
    try {
        const getUserId = req.params.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;
        
        const activityList = await Activity.find({ user_id: getUserId }).limit(limit).skip(skip);
        res.json(activityList);
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
    }
}

async function getSelectedActivity(req: Request, res: Response): Promise<void> {
    try {
        const getActId = req.params.id;
        const getActivity = await Activity.find({ _id: getActId });
        res.json(getActivity);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insertNewActivity(req: Request, res: Response): Promise<void> {
    try {
        const newActivity = new Activity(req.body)
        await newActivity.save();
        res.status(201).json({ message: 'New activity added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function updateSelectedActivity(req: Request, res: Response): Promise<void> {
    try {
        const getActId = req.params.id;
        await Activity.updateOne({ _id: getActId }, { 
            $set: { 
                act_name: req.body.act_name,
                schedule_at: req.body.schedule_at
            }
        });
        res.status(201).json({ message: 'Successfully updated activity' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export { 
    countAllActivities,
    deleteAllActivities,
    deleteSelectedActivity, 
    getAllActivities, 
    getSelectedActivity,
    insertNewActivity, 
    updateSelectedActivity 
}