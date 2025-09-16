export default function Pagination() {
    return (
        <div className="h-[10%] border border-white rounded-[1rem] backdrop-blur-sm backdrop-brightness-75 relative">
            <div className="flex justify-center items-center fixed inset-0">
                <div className="flex justify-center gap-[0.7rem] items-center">
                    <button type="button" className="cursor-pointer"><i className="fa-solid fa-backward text-white"></i></button>
                    <span className="text-white font-[550] text-[1rem]">Page 1 of 1</span>
                    <button type="button" className="cursor-pointer"><i className="fa-solid fa-forward text-white"></i></button>
                </div>
            </div>
        </div>
    );
}