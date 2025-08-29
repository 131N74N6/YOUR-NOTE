import type { NotificationProps } from "../services/custom-types";

export default function Notification(props: NotificationProps) {
    return (
        <div className={props.class_name}>
            <span>{props.message}</span>
        </div>
    );
}