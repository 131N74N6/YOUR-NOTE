import { Link } from "react-router-dom";
import type { NoteComponentProps } from "../services/custom-types";
import { memo } from "react";

const NoteList = memo((noteProps: NoteComponentProps) => {
    return (
        <div className="h-[250px] md:h-[300px] border-[1px] rounded-lg border-black p-[1rem] flex flex-col gap-[1rem]">
            <h3 className="font-[600]">{noteProps.note_title}</h3>
            <p>{noteProps.created_at.toLocaleString()}</p>
            <div className="h-[200px] overflow-hidden">{noteProps.note_content}</div>
            <div className="flex">
                <Link className="p-[0.4rem] text-[0.9rem] border border-black w-[87px] text-center" to={noteProps.onView}>View</Link>
                <button type="button" className="cursor-pointer p-[0.4rem] text-[0.9rem] bg-black text-white w-[87px] text-center" onClick={() => noteProps.onDelete(noteProps.id)}>Delete</button>
            </div>
        </div>
    );
});

export default NoteList;