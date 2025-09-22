import mongoose, { Schema, Types } from "mongoose";

interface INotes {
    created_at: string;
    note_content: string;
    note_title: string;
    user_id: Types.ObjectId;
}

const noteSchema = new Schema<INotes>({
    created_at: { type: String, required: true },
    note_content: { type: String, required: true },
    note_title: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
});

const Notes = mongoose.model<INotes>('note-list', noteSchema, 'note-list');

export { INotes, Notes }