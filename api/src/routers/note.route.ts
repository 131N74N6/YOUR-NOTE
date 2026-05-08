import { Router } from "express";
import { 
    countAllNotes, deleteAllNotes, deleteSelectedNote, getAllNotes, 
    getSelectedNote, insertNewNote, updateSelectedNote 
} from "../controllers/note.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const noteRoutes = Router();

noteRoutes.delete('/erase-all/:user_id', verifyToken, checkOwnership, deleteAllNotes);
noteRoutes.delete('/erase/:id', verifyToken, deleteSelectedNote);

noteRoutes.get('/get-all/:user_id', verifyToken, checkOwnership, getAllNotes);
noteRoutes.get('/selected/:id', verifyToken, getSelectedNote);
noteRoutes.get('/summary/:user_id', verifyToken, checkOwnership, countAllNotes);

noteRoutes.post('/add', verifyToken, insertNewNote);

noteRoutes.put('/change/:id', verifyToken, updateSelectedNote);

export default noteRoutes;