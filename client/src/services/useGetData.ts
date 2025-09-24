import type { IGetApi } from "./custom-types";
import useAuth from "./useAuth";

async function getData(props: IGetApi) {
    const { user } = useAuth();
    const token = user?.token;
    
    const request = await fetch(props.api_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const response = await request.json();
    return response;
}

export default getData;