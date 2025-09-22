import type { PaginationProps } from "../services/custom-types";

export default function Pagination(props: PaginationProps) {
    return (
        <div className="h-[10%] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75 relative">
            <div className="flex justify-center items-center fixed inset-0">
                <div className="flex justify-center gap-[0.7rem] items-center">
                    <button 
                        type="button" 
                        className="cursor-pointer disabled:opacity-50"
                        disabled={props.currentPage === 1}
                        onClick={props.onPrev}
                    >
                        <i className="fa-solid fa-backward text-white"></i>
                    </button>
                    <span className="text-white font-[550] text-[1rem]">
                        Page {props.currentPage} of {props.totalPages}
                    </span>
                    <button 
                        type="button" 
                        className="cursor-pointer disabled:opacity-50"
                        disabled={props.currentPage === props.currentPage}
                        onClick={props.onNext}
                    >
                        <i className="fa-solid fa-forward text-white"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}