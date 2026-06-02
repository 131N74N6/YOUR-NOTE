import type { ReactNode } from "react"
import useAuth from "../services/auth.services";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";

type IProtectedRoute = {
    children: ReactNode;
}

export default function ProtectedRoute(props: IProtectedRoute) {
    const { loading, currentUserId } = useAuth();
    if (loading) return <Loading/>

    return currentUserId ? <>{props.children}</> : <Navigate to={'/sign-in'}/>
}