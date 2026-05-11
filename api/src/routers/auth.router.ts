import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller";

const authRouters = Router();

authRouters.post('/sign-in', signIn);
authRouters.post('/sign-up', signUp);

export default authRouters;