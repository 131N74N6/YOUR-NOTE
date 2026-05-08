import dotenv from 'dotenv';
import dns from 'node:dns/promises';

dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log('DNS servers set to Cloudflare (1.1.1.1) and Google (8.8.8.8)');
}

import { db } from "./database/mongodb";
import express from "express";
import cors from 'cors';
import balanceRoutes from "./routers/balance.router";
import noteRoutes from "./routers/note.route";
import activityRoutes from "./routers/activity.router";
import authRoutes from "./routers/auth.router";

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:1234', 'http://localhost:5173', 'https://my-note-be.vercel.app/api', 'https://my-note-delta.vercel.app/']
}));
app.use('/api/activities', activityRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/auths', authRoutes);

if (process.env.NODE_ENV !== 'production') {
    db.then(() => {
        app.listen(1234, () => console.log(`server running at http://localhost:1234`));
    });
}

export default app;