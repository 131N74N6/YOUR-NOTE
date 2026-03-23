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
import userRoutes from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/activities', activityRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

if (process.env.NODE_ENV !== 'production') {
    db.then(() => {
        app.listen(1234, () => console.log(`server running at http://localhost:1234`));
    });
}

export default app;