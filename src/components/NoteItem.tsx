import { memo } from "react";
import type { NoteItemProps } from "../services/custom-types";
import { Link } from "react-router-dom";

const NoteItem = memo((props: NoteItemProps) => {
    return (
        <div className="flex flex-col gap-[0.45rem] p-[0.45rem] border border-white rounded-[0.45rem]">
            <div className="flex flex-col gap-[1rem]">
                <h3 className="font-[550] text-white">{props.note.note_title}</h3>
                <p className="text-white">{new Date(props.note.created_at).toLocaleString()}</p>
                <div className="md:h-[210px] h-[168px] overflow-hidden">
                    <p className="text-white">{props.note.note_content}</p>
                </div>
            </div>
            <div className="flex gap-[0.4em]">
                <Link className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px] text-center" to={`/note-detail/${props.note.id}`}>Select</Link>
                <button className="bg-white cursor-pointer text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]" type="button">Delete</button>
            </div>
        </div>
    );
});

export default NoteItem;