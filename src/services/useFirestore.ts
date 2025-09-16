import { collection, deleteDoc, doc, getCountFromServer, getDocs, limit, orderBy, Query, query, setDoc, startAfter, updateDoc, where, type DocumentData, type OrderByDirection } from "firebase/firestore";
import type { IDeleteData, IInsertData, IRealTime, IUpdateData } from "./custom-types";
import { db } from "./firebase-config";
import { useCallback, useEffect, useRef, useState } from "react";

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

    function realTimeInit(props: IRealTime) {
        const [data, setData] = useState<BINTANG[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [totalItems, setTotalItems] = useState(0);
        const lastDocRef = useRef<DocumentData | null>(null);
        const firstDocRef = useRef<DocumentData | null>(null);
        const docsPerPageRef = useRef<number>(props.items_each_page);

        const { collection_name, order_by_options = [], filters = [] } = props;

        // Fungsi untuk mengambil jumlah total dokumen
        const getTotalCount = useCallback(async (): Promise<number> => {
            try {
                let countQuery: Query<DocumentData> = collection(db, collection_name);
                
                filters.forEach(([field, op, value]) => {
                    countQuery = query(countQuery, where(field, op, value));
                });
                
                const snapshot = await getCountFromServer(countQuery);
                return snapshot.data().count;
            } catch (error) {
                console.error("Error getting total count:", error);
                return 0;
            }
        }, [collection_name, JSON.stringify(filters)]);

        // Fungsi utama untuk mengambil data
        const fetchData = useCallback(async (page: number, direction: 'next' | 'prev' | 'first' = 'first') => {
            setLoading(true);
            setError(null);

            try {
                let q: Query<DocumentData> = collection(db, collection_name);
                
                // Terapkan filters
                filters.forEach(([field, op, value]) => q = query(q, where(field, op, value)));
                
                // Terapkan order by
                order_by_options.forEach(([field, direction]) => q = query(q, orderBy(field, direction)));

                // Hitung total items dan pages
                const total = await getTotalCount();
                setTotalItems(total);
                setTotalPages(Math.ceil(total / docsPerPageRef.current));

                // Terapkan pagination
                if (direction === 'next' && lastDocRef.current) {
                    q = query(q, startAfter(lastDocRef.current), limit(docsPerPageRef.current));
                } else if (direction === 'prev' && firstDocRef.current) {
                    // Untuk previous page, kita perlu query yang lebih kompleks
                    // karena Firestore tidak mendukung backward pagination secara langsung
                    // Kita akan mengambil semua dokumen hingga firstDocRef.current dan mengambil items_per_page terakhir
                    const reversedOrder = order_by_options.map(([field, direction]) => 
                        [field, direction === 'asc' ? 'desc' : 'asc'] as [string, OrderByDirection]
                    );
                    
                    let reversedQ: Query<DocumentData> = collection(db, collection_name);
                    
                    filters.forEach(([field, op, value]) => {
                        reversedQ = query(reversedQ, where(field, op, value));
                    });
                    
                    reversedOrder.forEach(([field, direction]) => {
                        reversedQ = query(reversedQ, orderBy(field, direction));
                    });
                    
                    reversedQ = query(reversedQ, startAfter(firstDocRef.current), limit(docsPerPageRef.current));
                    
                    const reversedSnapshot = await getDocs(reversedQ);
                    const reversedDocs = reversedSnapshot.docs.reverse();
                    
                    const newData = reversedDocs.map(doc => ({ id: doc.id, ...doc.data() })) as BINTANG[];
                    setData(newData);
                    
                    if (reversedDocs.length > 0) {
                        firstDocRef.current = reversedDocs[0];
                        lastDocRef.current = reversedDocs[reversedDocs.length - 1];
                    }
                    
                    setCurrentPage(page);
                    setLoading(false);
                    return;
                } else {
                    // First page
                    q = query(q, limit(docsPerPageRef.current));
                }

                const querySnapshot = await getDocs(q);
                const docs = querySnapshot.docs;
                
                if (docs.length > 0) {
                    firstDocRef.current = docs[0];
                    lastDocRef.current = docs[docs.length - 1];
                }
                
                const newData = docs.map(doc => ({ id: doc.id, ...doc.data() })) as BINTANG[];
                setData(newData);
                setCurrentPage(page);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching paginated data:", err);
            } finally {
                setLoading(false);
            }
        }, [collection_name, JSON.stringify(filters), JSON.stringify(order_by_options), getTotalCount]);

        // useEffect untuk mengambil data pertama kali
        useEffect(() => {
            fetchData(1, 'first');
        }, [collection_name, JSON.stringify(filters), JSON.stringify(order_by_options)]);

        // Fungsi untuk next page
        const nextPage = () => {
            if (currentPage < totalPages) fetchData(currentPage + 1, 'next');
        };

        const prevPage = () => {
            if (currentPage > 1) fetchData(currentPage - 1, 'prev');
        };

        const goToPage = (page: number) => {
            if (page >= 1 && page <= totalPages && page !== currentPage) {
                if (page > currentPage) {
                    fetchData(page, 'next');
                } else {
                    fetchData(page, 'prev');
                }
            }
        };

        return {
            data,
            loading,
            error,
            currentPage,
            totalPages,
            totalItems,
            nextPage,
            prevPage,
            goToPage,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1
        }
    }

    async function updateData(props: IUpdateData<BINTANG>): Promise<void> {
        const docRef = doc(db, props.collection_name, props.values);
        await updateDoc(docRef, { ...props.new_data } as DocumentData);
    }

    return { insertData, deleteData, realTimeInit, updateData }
}