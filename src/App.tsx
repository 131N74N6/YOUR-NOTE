import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Balances from "./pages/Balances";
import Notes from "./pages/Notes";
import Activites from "./pages/Activites";
import ChatBot from "./pages/ChatBot";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import './styles/index.css';
import NoteForm from "./pages/NoteForm";
import SelectedNote from "./pages/SelectedNote";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                    <Route path="/balances" element={<ProtectedRoute><Balances/></ProtectedRoute>}/>
                    <Route path="/notes" element={<ProtectedRoute><Notes/></ProtectedRoute>}/>
                    <Route path="/add-note" element={<ProtectedRoute><NoteForm/></ProtectedRoute>}/>
                    <Route path="/note-detail/:id" element={<ProtectedRoute><SelectedNote/></ProtectedRoute>}/>
                    <Route path="/activities" element={<ProtectedRoute><Activites/></ProtectedRoute>}/>
                    <Route path="/chat-bot" element={<ProtectedRoute><ChatBot/></ProtectedRoute>}/>
                    <Route path="/" element={<Navigate to={'/home'} replace/>}/>
                    <Route path="*" element={<Navigate to={'/sign-in'} replace/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}