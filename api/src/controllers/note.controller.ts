import { Request, Response } from "express";
import { Notes } from "../models/note.model";

export async function countAllNotes(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const noteList = await Notes.find({ user_id: getUserId }).countDocuments();
        res.status(200).json(noteList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function deleteAllNotes(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const noteList = await Notes.find({ user_id: getUserId }).countDocuments();
        if (noteList === 0) return res.status(400).json({ message: 'No note to delete' });
        
        await Notes.deleteMany({ user_id: getUserId });
        res.status(200).json({ message: 'Successfully deleted all notes' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function deleteSelectedNote(req: Request, res: Response) {
    try {
        const getNoteById = req.params.id;
        await Notes.deleteOne({ _id: getNoteById });
        res.status(200).json({ message: 'Successfully deleted note' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function getAllNotes(req: Request, res: Response) {
    try {
        const getUserId = req.params.user_id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;
        
        const noteList = await Notes.find({ user_id: getUserId }).limit(limit).skip(skip);
        res.status(200).json(noteList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function getSelectedNote(req: Request, res: Response) {
    try {
        const getNoteById = req.params.id;
        const getNote = await Notes.find({ _id: getNoteById });
        res.status(200).json(getNote);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function insertNewNote(req: Request, res: Response) {
    try {
        const newNote = new Notes(req.body);

        if (!req.body.note_title && !req.body.note_content) return res.status(400).json({ message: 'Note title and content are required' });
        if (!req.body.note_title) return res.status(400).json({ message: 'Note title is required' });
        if (!req.body.note_content) return res.status(400).json({ message: 'Note content is required' });

        await newNote.save();
        res.status(200).json({ message: 'New note added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export async function updateSelectedNote(req: Request, res: Response) {
    try {
        const getNoteById = req.params.id;

        if (!req.body.note_title && !req.body.note_content) return res.status(400).json({ message: 'Note title and content are required' });
        if (!req.body.note_title) return res.status(400).json({ message: 'Note title is required' });
        if (!req.body.note_content) return res.status(400).json({ message: 'Note content is required' });

        await Notes.updateOne({ _id: getNoteById }, {  
            $set: {
                note_content: req.body.note_content,
                note_title: req.body.note_title
            }
        });
        res.status(200).json({ message: 'Successfully change note' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}