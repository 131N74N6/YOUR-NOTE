import { useState } from "react";
import type { IGetApi, IPostApi } from "./custom-types";

export default function ApiCalls<BINTANG>() {
    async function getData(props: IGetApi) {
        const [data, setData] = useState<BINTANG[]>([]);
        const [error, setError] = useState<string>('');
        const [loading, setLoading] = useState<boolean>(false);

        setLoading(true);
        try {
            const request = await fetch(props.api_url, {
                method: props.api_method,
            });

            if (request.ok) {
                const response = await request.json();
                setData(response);
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

        return { data, error, loading }
    }

    async function insertData(props: IPostApi<BINTANG>) {
        const [data, setData] = useState<BINTANG[]>([]);
        const [error, setError] = useState<string>('');
        const [loading, setLoading] = useState<boolean>(false);
        
        setLoading(true);
        try {
            const request = await fetch(props.api_url, { 
                method: props.api_method, body: JSON.stringify(props.api_data) 
            });

            if (request.ok) {
                const response = await request.json();
                setData(response);
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

        return { data, error, loading }
    }

    return { getData, insertData }
}