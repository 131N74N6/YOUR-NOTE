import type { IDeleteApi, IPostApi, IPutApi } from "./custom-types";
import useAuth from "./useAuth";

export default function useApiCalls<HX>() {
    const { user } = useAuth();
    const token = user ? user.token : null;

    async function deleteData(props: IDeleteApi): Promise<void> {
        const request = await fetch(props.api_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();

        if (request.ok) return response;
        else throw new Error(response.message);
    }

    async function getData(api_url: string) {
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

    async function insertData(props: IPostApi<HX>) {
        const request = await fetch(props.api_url, { 
            method: 'POST', 
            body: JSON.stringify(props.api_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();

        if (request.ok) return response;
        else throw new Error(response.message);
    }

    async function updateData(props: IPutApi<HX>) {
        const request = await fetch(props.api_url, { 
            method: 'PUT', 
            body: JSON.stringify(props.api_data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const response = await request.json();
            
        if (request.ok) return response;
        else throw new Error(response.message);
    }

    return { deleteData, getData, insertData, updateData }
}