import { 
    average, collection, deleteDoc, doc, getAggregateFromServer, getCountFromServer, getDocs, 
    onSnapshot, orderBy, Query, query, setDoc, sum, updateDoc, where 
} from "firebase/firestore";
import type { DocumentData, FirestoreError, QuerySnapshot } from "firebase/firestore";
import type { IDeleteData, IInsertData, IRealTime, IUpdateData, SummarizeData } from "./custom-types";
import { db } from "./firebase-config";
import { useEffect, useState } from "react";

export default function useFirestore<BINTANG extends { id: string }>() {
    async function insertData(props: IInsertData<BINTANG>): Promise<string> {
        const newDocRef = doc(collection(db, props.collection_name));
        await setDoc(newDocRef, { id: newDocRef.id, created_at: new Date().toISOString(), ...props.new_data });
        return newDocRef.id;
    }

    async function deleteData(props: IDeleteData) {
        if (props.values) {
            const docRef = doc(db, props.collection_name, props.values);
            await deleteDoc(docRef);
        } else if (props.filters) {
            let q: Query<DocumentData> = collection(db, props.collection_name);
            props.filters.forEach(([field, op, value]) => q = query(q, where(field, op, value)));

            const querySnapshot = await getDocs(q);
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        
            await Promise.all(deletePromises);
        }
    }

    async function summarize(props: SummarizeData) {
        const collRef = collection(db, props.collection_name);
        const q = query(collRef, where(props.field1, props.sign, props.values));
        const total = await getAggregateFromServer(q, { total: sum(props.field2) });
        return total.data().total;
    }

    async function getAverages(props: SummarizeData) {
        const collRef = collection(db, props.collection_name);
        const q = query(collRef, where(props.field1, props.sign, props.values));
        const avg = await getAggregateFromServer(q, { total: average(props.field2) });
        return avg.data().total;
    }

    async function countData(props: SummarizeData) {
        const collRef = collection(db, props.collection_name);
        const q = query(collRef, where(props.field1, props.sign, props.values));
        const totalData = await getCountFromServer(q);
        return totalData.data().count;
    }

    function realTimeInit(props: IRealTime) {
        const [data, setData] = useState<BINTANG[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        
        useEffect(() => {
            const { collection_name, order_by_options = [], filters = [] } = props;
            let q: Query<DocumentData> = collection(db, collection_name);
            
            filters.forEach(([field, op, value]) =>  q = query(q, where(field, op, value)));
            
            order_by_options.forEach(([field, direction]) => q = query(q, orderBy(field, direction)));
            
            const unsubscribe = onSnapshot(q, 
                (snapshot: QuerySnapshot<DocumentData, DocumentData>): void => {
                    const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BINTANG[];
                    setData(newData);
                    setLoading(false);
                },
                (error: FirestoreError): void => {
                    setError(error.message);
                    setLoading(false);
                }
            );
            
            return () => unsubscribe();
        }, [props.collection_name, JSON.stringify(props.filters), JSON.stringify(props.order_by_options)]);
        
        return { data, loading, error };
    }

    async function updateData(props: IUpdateData<BINTANG>): Promise<void> {
        const docRef = doc(db, props.collection_name, props.values);
        await updateDoc(docRef, { ...props.new_data } as DocumentData);
    }

    return { countData, deleteData, insertData, getAverages, realTimeInit, summarize, updateData }
}