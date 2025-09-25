import { Router } from "express";
import { 
    deleteAllNotes, deleteSelectedNote, getAllNotes, 
    getSelectedNote, insertNewNote, updateSelectedNote 
} from "../controllers/note.controller";

const noteRoutes = Router();

noteRoutes.delete('/erase-all/:id', deleteAllNotes);

noteRoutes.delete('/erase/:id', deleteSelectedNote);

noteRoutes.get('/get-all/:id', getAllNotes);

noteRoutes.get('/selected/:id', getSelectedNote);

noteRoutes.post('/add', insertNewNote);

noteRoutes.put('/change/:id', updateSelectedNote);

export default noteRoutes;