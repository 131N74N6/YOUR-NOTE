import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ToDo from "./pages/ToDo";
import Home from "./pages/Home";
import NoteDetail from "./pages/NoteDetail";

export default function App() {
    const initClient = new QueryClient();
    return (
        <>
            <QueryClientProvider client={initClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<SignIn/>}/>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/todo" element={<ToDo/>}/>
                        <Route path="/note-detail/:id" element={<NoteDetail/>}/>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </>
    );
}