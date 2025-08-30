import type { ListActFormProps } from "../services/custom-types";

export default function ListActForm(props: ListActFormProps) {
    return (
        <form onSubmit={props.onSend} className="flex justify-center items-center fixed inset-0 z-20 bg-[rgba(0,0,0,0.3)]">
            <div className="bg-white flex flex-col gap-[1rem] p-[1rem] w-[305px] border border-black">
                <input 
                    type="text" 
                    placeholder="your goals" 
                    value={props.actName} onChange={props.onChangeActName}
                    className="p-[0.4rem] text-[0.9rem] outline-0 border border-black"
                />
                <div className="flex">
                    <button type="button" className="bg-white text-black text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border border-black w-[65px]" onClick={props.onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <button type="submit" className="bg-black text-white text-[0.9rem] font-[550] cursor-pointer p-[0.3rem] border-0 w-[65px]">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </form>
    );
}