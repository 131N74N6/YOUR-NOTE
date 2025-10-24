import { Request, Response } from "express";
import { Notes } from "../models/note.model";

async function countAllNotes(req: Request, res: Response): Promise<void> {
    try {
        const getUserId = req.params.id;
        const noteList = await Notes.find({ user_id: getUserId }).countDocuments();
        res.json(noteList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function deleteAllNotes(req: Request, res: Response): Promise<void> {
    try {
        const getUserId = req.params.id;
        await Notes.deleteMany({ user_id: getUserId });
        res.status(201).json({ message: 'Successfully deleted all notes' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function deleteSelectedNote(req: Request, res: Response): Promise<void> {
    try {
        const getNoteById = req.params.id;
        await Notes.deleteOne({ _id: getNoteById });
        res.status(201).json({ message: 'Successfully deleted note' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getAllNotes(req: Request, res: Response): Promise<void> {
    try {
        const getUserId = req.params.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;
        
        const noteList = await Notes.find({ user_id: getUserId }).limit(limit).skip(skip);
        res.json(noteList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getSelectedNote(req: Request, res: Response): Promise<void> {
    try {
        const getNoteById = req.params.id;
        const getNote = await Notes.find({ _id: getNoteById });
        res.json(getNote);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insertNewNote(req: Request, res: Response): Promise<void> {
    try {
        const newNote = new Notes(req.body);
        await newNote.save();
        res.status(201).json({ message: 'New note added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function updateSelectedNote(req: Request, res: Response): Promise<void> {
    try {
        const getNoteById = req.params.id;
        await Notes.updateOne({ _id: getNoteById }, {  
            $set: {
                note_content: req.body.note_content,
                note_title: req.body.note_title
            }
        });
        res.status(201).json({ message: 'Successfully change note' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export {
    countAllNotes,
    deleteAllNotes,
    deleteSelectedNote,
    getAllNotes,
    getSelectedNote,
    insertNewNote,
    updateSelectedNote
}