import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller";

const authRouters = Router();

authRouters.post('/sign-in', signIn);
authRouters.post('/sign-up', signUp);
authRouters.post('/sign-out', signOut);

export default authRouters;