import type { NoteListProps } from "../services/custom-types";
import Loading from "./Loading";
import NoteItem from "./NoteItem";

const NoteList = (props: NoteListProps) => {
    if (props.notes.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-white font-[600] text-[1rem]">No notes found...</span>
            </section>
        );
    }

    return (
        <div className="flex flex-col gap-[1rem] overflow-y-auto">            
            <div className="grid lg:grid-cols-3 gap-[0.7rem] md:grid-cols-2 grid-cols-1">
                {props.notes.map((note) => (
                    <NoteItem key={`note_${note._id}`} note={note} onDelete={props.onDelete}/>
                ))}
            </div>
            <div className="flex justify-center">
                {props.isLoadMore ? <Loading/> : null}
                {props.notes.length < 12 ? (
                    <></>
                ) : props.isReachedEnd && props.notes.length > 0 ? (
                    <p className="text-white font-[500] text-center text-[1rem]">No More Data to Show</p>
                ) : (
                    <button 
                        type="button"
                        onClick={() => props.getMore()}
                        className="bg-white text-gray-800 w-[120px] rounded font-[500] cursor-pointer p-[0.4rem] text-[0.9rem]"
                    >
                        Load More
                    </button> 
                )}
            </div>
        </div>
    );
}

export default NoteList;