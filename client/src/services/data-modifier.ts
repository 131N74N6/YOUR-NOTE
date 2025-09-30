import type { IDeleteApi, IPostApi, IPutApi } from "./custom-types";
import useAuth from "./useAuth";

export default function useApiCalls() {
    const { user } = useAuth();
    const token = user && user.token;

    const deleteData = async(props: IDeleteApi) => {
        const request = await fetch(props.api_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();
        return response;
    }

    const getData = async (api_url: string) => {
        const request = await fetch(api_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();
        return response;
    }

    const insertData = async <HX>(props: IPostApi<HX>) => {
        const request = await fetch(props.api_url, { 
            method: 'POST', 
            body: JSON.stringify(props.api_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();
        return response;
    }

    const updateData = async <HX>(props: IPutApi<HX>) => {
        const request = await fetch(props.api_url, { 
            method: 'PUT', 
            body: JSON.stringify(props.api_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();
        return response;
    }

    return { deleteData, getData, insertData, updateData }
}