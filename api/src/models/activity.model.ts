import mongoose, { Schema, Types } from "mongoose";

interface IActivity {
    act_name: string;
    created_at: string;
    schedule_at: string;
    user_id: Types.ObjectId;
}

const activitySchema = new Schema<IActivity>({
    act_name: { type: String, required: true },
    created_at: { type: String, required: true },
    schedule_at: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
});

const Activity = mongoose.model<IActivity>('activity-list', activitySchema, 'activity-list');

export { Activity, IActivity }