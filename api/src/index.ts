import { db } from "./database/mongodb";
import express from "express";
import balanceRoutes from "./routes/balance.router";
import noteRoutes from "./routes/note.route";
import activityRoutes from "./routes/activity.router";
import userRoutes from "./routes/user.router";

const app = express();

app.use(express.json());
app.use('/activities', activityRoutes);
app.use('/balances', balanceRoutes);
app.use('/notes', noteRoutes);
app.use('/users', userRoutes);

db.then(() => {
    app.listen(1234, () => console.log(`server running at http://localhost:1234`));
});