import type { IDeleteApi, IPostApi, IPutApi } from "./custom-types";
import useAuth from "./useAuth";

export default function useApiCalls<BINTANG>() {
    const { user } = useAuth();
    const token = user?.token;

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

    async function insertData(props: IPostApi<BINTANG>) {
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

    async function updateData(props: IPutApi<BINTANG>) {
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

    return { deleteData, insertData, updateData }
}