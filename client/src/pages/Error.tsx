import type { ErrorPage } from "../services/custom-types";

export default function ErrorMessage(props: ErrorPage) {
    return (
        <div className="flex justify-center items-center h-screen bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <div className="text-white font-[550] text-[1.6rem]">{props.message}</div>
        </div>
    );
}