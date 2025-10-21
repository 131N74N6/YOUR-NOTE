import type { ActivityFormProps } from "../services/custom-types";

const ActivityForm = (props: ActivityFormProps) => {
    return (
        <form onSubmit={props.onSave} className="flex justify-center items-center fixed inset-0 z-20 border bg-[rgba(0,0,0,0.66)]">
            <div className="bg-[#1a1a1a] flex flex-col gap-[1rem] p-[1rem] w-[300px] h-[300px] border border-white">
                <input 
                    type="text" 
                    placeholder="ex: watch movie" 
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                    value={props.act_name}
                    onChange={props.changeActName}
                />
                <input 
                    type="datetime-local" 
                    className="border border-white p-[0.45rem] text-white text-[0.9rem] outline-0"
                    value={props.schedule_at}
                    onChange={props.makeSchedule}
                />
                <div className="flex gap-[0.7rem]">
                    <button 
                        type="button" 
                        disabled={props.isDataChanging}
                        className="bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]" 
                        onClick={props.onClose}
                    >
                        Close
                    </button>
                    <button 
                        type="submit" 
                        disabled={!props.act_name || !props.schedule_at || props.isDataChanging} 
                        className="bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 p-[0.3rem] rounded-[0.3rem] font-[500] text-[0.9rem] w-[85px]"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
}

export default ActivityForm;