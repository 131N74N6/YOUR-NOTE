import { Request, Response, Router } from "express";
import { Notes } from "../models/note.model";

const noteRoutes = Router();

noteRoutes.get('/', async (_, res: Response) => {
    try {
        const noteList = await Notes.find();
        res.json(noteList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

noteRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const getNoteById = req.params.id;
        const getNote = await Notes.find({ _id: getNoteById });
        res.json(getNote);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

noteRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const getNoteById = req.params.id;
        await Notes.deleteOne({ _id: getNoteById });
        res.status(201).json({ message: 'Successfully deleted note' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

noteRoutes.delete('/', async (req: Request, res: Response) => {
    try {
        await Notes.deleteMany();
        res.status(201).json({ message: 'Successfully deleted all notes' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

noteRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const newNote = new Notes(req.body);
        await newNote.save();
        res.status(201).json({ message: 'New note added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

noteRoutes.put('/:id', async (req: Request, res: Response) => {
    try {
        const getNoteById = req.params.id;
        await Notes.updateOne({ _id: getNoteById }, {  
            $set: {
                note_content: req.body.editContent,
                note_title: req.body.editTitle
            }
        });
        res.status(201).json({ message: 'Successfully change note' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default noteRoutes;