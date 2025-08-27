export interface DatabaseProps {
    tableName: string;
    additionalQuery?: (query: any) => any;
    relationalQuery?: string;
}

export type InsertDataProps<A> = {
    tableName: string; 
    newData: Omit<A, 'id' | 'created_at'>;
}

export type UpsertDataProps<A> = {
    tableName: string; 
    dataToUpsert: Partial<A>;
}

export type UpdateDataProps<A> = {
    values: string;
    column: string;
    tableName: string;
    newData: Partial<Omit<A, 'id' | 'created_at'>>
}

export type DeleteDataProps = {
    tableName: string;
    column?: string;
    values?: string | string[];
}

export type Users = {
    id: string;
    created_at: Date;
    email: string;
    username: string;
    password: string;
}

export type Activity = {
    id: string;
    created_at: Date;
    act_name: string;
    user_id: string;
}

export type ActivityComponentProps = Activity & {
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export type Note = {
    id: string;
    created_at: Date;
    note_title: string;
    note_content: string;
    user_id: string;
}

export type NoteComponentProps = Note & {
    onView: string;
    onDelete: (id: string) => void;
}