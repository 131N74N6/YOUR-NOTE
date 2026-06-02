import { Router } from "express";
import { deleteUser, editUserInfo, getUserInfo } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const userRouters = Router();

userRouters.delete('/rm', verifyToken, deleteUser);
userRouters.get('/show', verifyToken, getUserInfo);
userRouters.put('/edit', verifyToken, editUserInfo);

export default userRouters;