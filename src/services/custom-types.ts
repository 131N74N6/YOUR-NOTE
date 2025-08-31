export interface DatabaseProps {
    tableName: string;
    additionalQuery?: (query: any) => any;
    relationalQuery?: string;
    uniqueQueryKey?: any[];
    filterKey?: string;
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

export type ActivityFormProps = {
    actName: string;
    onChangeActName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: (event: React.FormEvent) => Promise<void>;
    onClose: () => void;
}

export type Activity = {
    id: string;
    created_at: Date;
    act_name: string;
    user_id: string;
}

export type ActivityListProps = {
    data: Activity[];
    selectedId: string | null;
    newActivity: string;
    onSelect: (id: string, activity: string) => void;
    onCancel: () => void;
    onUpdate: (id: string, newActivity: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEditActivityChange: (newActivity: string) => void;
}

export type ActivityItemProps = {
    detail: Activity;
    isSelected: boolean;
    newActivity: string;
    onSelect: (id: string, activity: string) => void;
    onCancel: () => void;
    onUpdate: (id: string, newActivity: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEditActivityChange: (newActivity: string) => void;
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

export type NavbarProps = {
    class_name: string;
}

export type NotificationProps = {
    class_name: string;
    message: string;
}

export type AIResponse = {
    choices: Array<{ message: { content: string } }>;
    error: { message: string }
}