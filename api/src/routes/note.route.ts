import { Router } from "express";
import { 
    deleteAllNotes, deleteSelectedNote, getAllNotes, 
    getSelectedNote, insertNewNote, updateSelectedNote 
} from "../controllers/note.controller";

const noteRoutes = Router();

noteRoutes.delete('/', deleteAllNotes);

noteRoutes.delete('/:id', deleteSelectedNote);

noteRoutes.get('/', getAllNotes);

noteRoutes.get('/:id', getSelectedNote);

noteRoutes.post('/', insertNewNote);

noteRoutes.put('/:id', updateSelectedNote);

export default noteRoutes;