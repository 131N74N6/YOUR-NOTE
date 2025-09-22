import { Request, Response, Router } from "express";
import { Activity } from "../models/activity.model";

const activityRoutes = Router();

activityRoutes.get('/', async (_, res: Response) => {
    try {
        const activityList = await Activity.find();
        res.json(activityList);
    } catch (error) {
        res.status(500).send({ message: 'Something went wrong' });
    }
});

activityRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const getActId = req.params.id;
        const getActivity = await Activity.find({ _id: getActId });
        res.json(getActivity);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

activityRoutes.delete('/', async (_, res: Response) => {
    try {
        await Activity.deleteMany();
        res.status(201).json({ message: 'Successfully deleted all' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

activityRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const getActId = req.params.id;
        await Activity.deleteOne({ _id: getActId });
        res.status(201).json({ message: 'Successfully deleted one activity' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

activityRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const newActivity = new Activity(req.body)
        await newActivity.save();
        res.status(201).json({ message: 'New activity added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

activityRoutes.put('/:id', async (req: Request, res: Response) => {
    try {
        const getActId = req.params.id;
        await Activity.updateOne({ _id: getActId }, { 
            $set: { 
                act_name: req.body.editActName,
                schedule_at: req.body.editScheduleAt
            }
        });
        res.status(201).json({ message: 'Successfully updated activity' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default activityRoutes;