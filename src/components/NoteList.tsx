import { memo } from "react";
import type { NoteListProps } from "../services/custom-types";
import NoteItem from "./NoteItem";

const NoteList = memo((props: NoteListProps) => {
    if (props.notes.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-white font-[600] text-[1rem]">No notes added currently...</span>
            </section>
        );
    }

    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
            {props.notes.map((note, index) => (
                <NoteItem key={`${note.id}_${index}`} note={note} onDelete={props.onDelete}/>
            ))}
        </div>
    );
});

export default NoteList;