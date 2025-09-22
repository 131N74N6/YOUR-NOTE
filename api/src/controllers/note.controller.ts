import { Request, Response } from "express";
import { Notes } from "../models/note.model";

async function deleteAllNotes(req: Request, res: Response) {
    try {
        await Notes.deleteMany();
        res.status(201).json({ message: 'Successfully deleted all notes' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function deleteSelectedNote(req: Request, res: Response) {
    try {
        const getNoteById = req.params.id;
        await Notes.deleteOne({ _id: getNoteById });
        res.status(201).json({ message: 'Successfully deleted note' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getAllNotes(_: Request, res: Response) {
    try {
        const noteList = await Notes.find();
        res.json(noteList);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function getSelectedNote(req: Request, res: Response) {
    try {
        const getNoteById = req.params.id;
        const getNote = await Notes.find({ _id: getNoteById });
        res.json(getNote);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function insertNewNote(req: Request, res: Response) {
    try {
        const newNote = new Notes(req.body);
        await newNote.save();
        res.status(201).json({ message: 'New note added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

async function updateSelectedNote(req: Request, res: Response) {
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
}

export {
    deleteAllNotes,
    deleteSelectedNote,
    getAllNotes,
    getSelectedNote,
    insertNewNote,
    updateSelectedNote
}