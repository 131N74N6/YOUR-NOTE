import { Router } from "express";
import { 
    countAllNotes, deleteAllNotes, deleteSelectedNote, getAllNotes, 
    getSelectedNote, insertNewNote, updateSelectedNote 
} from "../controllers/note.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const noteRouters = Router();

noteRouters.delete('/erase-all/:user_id', verifyToken, checkOwnership, deleteAllNotes);
noteRouters.delete('/erase/:id', verifyToken, deleteSelectedNote);

noteRouters.get('/get-all/:user_id', verifyToken, checkOwnership, getAllNotes);
noteRouters.get('/selected/:id', verifyToken, getSelectedNote);
noteRouters.get('/summary/:user_id', verifyToken, checkOwnership, countAllNotes);

noteRouters.post('/add', verifyToken, insertNewNote);

noteRouters.put('/change/:id', verifyToken, updateSelectedNote);

export default noteRouters;