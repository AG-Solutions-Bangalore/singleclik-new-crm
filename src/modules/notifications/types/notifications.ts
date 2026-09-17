export interface NotificationRow {
  id: number;
  notification_heading?: string | null;
  notification_des?: string | null;
  notification_images?: string | null;
  notification_status?: string | null;
}

export interface NotificationForm {
  notification_heading: string;
  notification_des: string;
  notification_images: string;
  notification_status: string;
}
