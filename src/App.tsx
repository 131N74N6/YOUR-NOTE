import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ToDo from "./pages/ToDo";
import Home from "./pages/Home";
import NoteDetail from "./pages/NoteDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AddNote from "./pages/AddNote";
import AskAI from "./pages/AskAI";

export default function App() {
    const initClient = new QueryClient();
    return (
        <>
            <QueryClientProvider client={initClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/signin" element={<SignIn/>}/>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                        <Route path="/todo" element={<ProtectedRoute><ToDo/></ProtectedRoute>}/>
                        <Route path="/add-note" element={<ProtectedRoute><AddNote/></ProtectedRoute>}/>
                        <Route path="/ask-ai" element={<ProtectedRoute><AskAI/></ProtectedRoute>}/>
                        <Route path="/note-detail/:id" element={<ProtectedRoute><NoteDetail/></ProtectedRoute>}/>
                        <Route path="/" element={<Navigate to="/home" replace/>} />
                        <Route path="*" element={<Navigate to="/signin" replace/>} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </>
    );
}