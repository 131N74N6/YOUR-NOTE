import ListAct from "../components/ListAct";
import Navbar from "../components/Navbar";
import type { Activity } from "../services/custom-types";
import { useSupabaseTable } from "../services/useSupabaseTable";

export default function ToDo() {
    let currentUserId = '';
        const activityTable = 'activity_list';
        const { data, isLoading, error, deleteData } = useSupabaseTable<Activity>({ 
            tableName: activityTable, 
            additionalQuery: (addQuery) => addQuery.eq('user_id', currentUserId)
        });
    
        async function deleteSelectedActivity(actId: string) {
            try {
                if (data.length > 0) {            
                    await deleteData({ 
                        tableName: activityTable, 
                        column: 'id', 
                        values: actId 
                    });
                } 
            } catch (error) {
                
            }
        }
    
        if (isLoading) {
            return <div>Loading...</div>
        }
    
        if (error) {
            return <div>{error.message}</div>
        }
    
        return (
            <>
                <div className="flex p-[1rem] gap-[1rem]">
                    <Navbar/>
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-3">
                        {data.map(act => <ListAct 
                            id={act.id} created_at={act.created_at} user_id={act.user_id}
                            act_name={act.act_name} 
                            onDelete={() => deleteSelectedActivity(act.id)} 
                            onSelect={() => deleteSelectedActivity(act.id)}
                        />)}
                    </div>
                </div>
            </>
        );
}
