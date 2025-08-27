import { Link } from "react-router-dom";
import type { NoteComponentProps } from "../services/custom-types";

export default function NoteList(noteProps: NoteComponentProps) {
    return (
        <div className="border-[1px] border-black p-[1rem]">
            <h3>{noteProps.note_title}</h3>
            <p>{noteProps.created_at.toLocaleString()}</p>
            <div className="h-[330px] overflow-y-hidden">{noteProps.note_content}</div>
            <div className="flex gap-[0.7rem]">
                <Link to={noteProps.onView}>View</Link>
                <button type="button" onClick={() => noteProps.onDelete(noteProps.id)}>Delete</button>
            </div>
        </div>
    );
}