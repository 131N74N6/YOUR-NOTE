import type { ReactNode } from "react"
import useAuth from "../services/auth.service";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";

type IProtectedRoute = {
    children: ReactNode;
}

export default function ProtectedRoute(props: IProtectedRoute) {
    const { userLoading, currentUserId } = useAuth();
    if (userLoading) return <Loading/>

    return currentUserId ? <>{props.children}</> : <Navigate to={'/sign-in'}/>
}