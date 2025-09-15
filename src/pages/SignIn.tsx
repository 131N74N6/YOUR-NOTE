import { Link } from "react-router-dom";

export default function SignIn() {
    return (
        <div className="flex justify-center items-center h-screen bg-[url('https://res.cloudinary.com/dfreeafbl/image/upload/v1757946836/cloudy-winter_iprjgv.png')]">
            <form className="border border-black backdrop-blur-sm p-[1rem] flex flex-col gap-[1rem] w-[320px]">
                <div className="font-[650] text-[1.5rem] text-center text-black">Hello</div>
                
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="email" className="text-black font-[600]">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        className="p-[0.45rem] text-[0.9rem] text-black outline-0 border border-gray-800 font-[600] rounded" 
                        placeholder="your@gmail.com"
                        required
                    />
                </div>
                
                <div className="flex flex-col gap-[0.5rem]">
                    <label htmlFor="password" className="font-[600] text-black">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        className="p-[0.45rem] text-[0.9rem] text-black outline-0 border border-gray-800 font-[600] rounded" 
                        placeholder="your_password"
                        required
                    />
                </div>
                
                <div className="text-center text-sm">
                    <span className="text-black">Don't have an account?</span> <Link className="text-blue-800 hover:underline" to={'/sign-up'}>Sign Up</Link>
                </div>
                
                {/* {showMessage && (
                    <div className="text-amber-600 text-sm font-medium text-center p-2 bg-red-100 rounded">
                        {message}
                    </div>
                )} */}
                
                <button 
                    type="submit" 
                    className="p-[0.45rem] text-[0.9rem] outline-0 border-0 bg-black text-white font-[550] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-purple-800 transition-colors"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}