import type { ReactNode } from "react"
import useAuth from "../services/useAuth";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";

type IProtectedRoute = {
    children: ReactNode;
}

export default function ProtectedRoute(props: IProtectedRoute) {
    const { loading, user } = useAuth();
    if (loading) return <Loading/>

    return user ? <>{props.children}</> : <Navigate to={'/signin'}/>
}