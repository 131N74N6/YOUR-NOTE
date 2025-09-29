import { Router } from "express";
import { 
    countAllNotes, deleteAllNotes, deleteSelectedNote, getAllNotes, 
    getSelectedNote, insertNewNote, updateSelectedNote 
} from "../controllers/note.controller";

const noteRoutes = Router();

noteRoutes.delete('/erase-all/:id', deleteAllNotes);

noteRoutes.delete('/erase/:id', deleteSelectedNote);

noteRoutes.get('/get-all/:id', getAllNotes);

noteRoutes.get('/selected/:id', getSelectedNote);

noteRoutes.get('/summary/:id', countAllNotes);

noteRoutes.post('/add', insertNewNote);

noteRoutes.put('/change/:id', updateSelectedNote);

export default noteRoutes;