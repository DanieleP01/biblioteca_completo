export interface Notification {
    id: number;
    recipient_id: number;
    recipient_role: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}