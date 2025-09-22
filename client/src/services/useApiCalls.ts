import { useState } from "react";
import type { IDeleteApi, IGetApi, IPostApi, IPutApi } from "./custom-types";
import useAuth from "./useAuth";

export default function useApiCalls<BINTANG>() {
    const [data, setData] = useState<BINTANG[]>([]);
    const [error, setError] = useState<string | null>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const token = user?.token;

    async function deleteData(props: IDeleteApi): Promise<void> {
        setLoading(true);
        try {
            const request = await fetch(props.api_url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (request.ok) {
                const response = await request.json();
                setData(response);
                setError(null);
            } else if (request.status === 400) {
                throw new Error('Failed to get data. Try again later')
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error: any) {
            setError(error.message);
        }
    }

    async function getData(props: IGetApi): Promise<void> {
        setLoading(true);
        try {
            const request = await fetch(props.api_url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (request.ok) {
                const response = await request.json();
                setData(response);
                setError(null);
            } else if (request.status === 400) {
                throw new Error('Failed to get data. Try again later')
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false)
        }
    }

    async function insertData(props: IPostApi<BINTANG>) {
        setLoading(true);
        try {
            const request = await fetch(props.api_url, { 
                method: 'POST', body: JSON.stringify(props.api_data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (request.ok) {
                const response = await request.json();
                setData(response);
                setError(null);
            } else if (request.status === 400) {
                throw new Error('Failed to get data. Try again later')
            } else {
                throw new Error("GAGAL MEMBUAT POSTINGAN");
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateData(props: IPutApi<BINTANG>) {
        setLoading(true);
        try {
            const request = await fetch(props.api_url, { 
                method: 'PUT', body: JSON.stringify(props.api_data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (request.ok) {
                const response = await request.json();
                setData(response);
                setError(null);
            } else if (request.status === 400) {
                throw new Error('Failed to get data. Try again later')
            } else {
                throw new Error("GAGAL MEMBUAT POSTINGAN");
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { data, deleteData, error, getData, insertData, loading, updateData }
}