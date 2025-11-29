import { Router } from "express";
import { 
    countAllNotes, deleteAllNotes, deleteSelectedNote, getAllNotes, 
    getSelectedNote, insertNewNote, updateSelectedNote 
} from "../controllers/note.controller";
import { checkOwnership, verifyToken } from "../middleware/auth.middleware";

const noteRoutes = Router();

noteRoutes.delete('/erase-all/:id', verifyToken, checkOwnership, deleteAllNotes);

noteRoutes.delete('/erase/:id', verifyToken, deleteSelectedNote);

noteRoutes.get('/get-all/:id', verifyToken, checkOwnership, getAllNotes);

noteRoutes.get('/selected/:id', verifyToken, getSelectedNote);

noteRoutes.get('/summary/:id', verifyToken, checkOwnership, countAllNotes);

noteRoutes.post('/add', verifyToken, insertNewNote);

noteRoutes.put('/change/:id', verifyToken, updateSelectedNote);

export default noteRoutes;