import { Request, Response } from "express";
import { Activity } from "../models/activity.model";

export async function countAllActivities(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const activityList = await Activity.find({ user_id: getUserId }).countDocuments();
        res.status(200).json(activityList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function deleteAllActivities(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const activityList = await Activity.find({ user_id: getUserId }).countDocuments();
        if (activityList === 0) return res.status(400).json({ message: 'No activity to delete' });
        
        await Activity.deleteMany({ user_id: getUserId });
        res.status(200).json({ message: 'Successfully deleted all' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function deleteSelectedActivity(req: Request, res: Response) {
    try {
        const getActId = req.params.id;
        await Activity.deleteOne({ _id: getActId });
        res.status(200).json({ message: 'Successfully deleted one activity' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function getAllActivities(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;
        
        const activityList = await Activity.find({ user_id: getUserId }).limit(limit).skip(skip);
        res.status(200).json(activityList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function getSelectedActivity(req: Request, res: Response) {
    try {
        const getActId = req.params.id;
        const getActivity = await Activity.find({ _id: getActId });
        res.status(200).json(getActivity);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function insertNewActivity(req: Request, res: Response) {
    try {
        const newActivity = new Activity(req.body);

        if (!req.body.act_name && !req.body.schedule_at) return res.status(400).json({ message: 'Activity name and schedule are required' });
        if (!req.body.act_name) return res.status(400).json({ message: 'Activity name is required' });
        if (!req.body.schedule_at) return res.status(400).json({ message: 'Schedule is required' });

        await newActivity.save();
        res.status(200).json({ message: 'New activity added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function updateSelectedActivity(req: Request, res: Response) {
    try {
        const getActId = req.params.id;
        
        if (!req.body.act_name && !req.body.schedule_at) return res.status(400).json({ message: 'Activity name and schedule are required' });
        if (!req.body.act_name) return res.status(400).json({ message: 'Activity name is required' });
        if (!req.body.schedule_at) return res.status(400).json({ message: 'Schedule is required' });
        
        await Activity.updateOne({ _id: getActId }, { 
            $set: { 
                act_name: req.body.act_name,
                schedule_at: req.body.schedule_at
            }
        });
        res.status(200).json({ message: 'Successfully updated activity' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}