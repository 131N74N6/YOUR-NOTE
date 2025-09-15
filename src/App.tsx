import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Balances from "./pages/Balances";
import Notes from "./pages/Notes";
import Activites from "./pages/Activites";
import ChatBot from "./pages/ChatBot";
import './styles/index.css';

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SignIn/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/balances" element={<Balances/>}/>
                    <Route path="/notes" element={<Notes/>}/>
                    <Route path="/activities" element={<Activites/>}/>
                    <Route path="/chat-bot" element={<ChatBot/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}