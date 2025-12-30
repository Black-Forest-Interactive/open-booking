export interface NotificationTemplate {
  id: number,
  lang: string,
  type: string,
  subject: string,
  content: string
}

export class NotificationTemplateChangeRequest {
  constructor(
    public lang: string,
    public type: string,
    public subject: string,
    public content: string
  ) {
  }
}

export const NOTIFICATION_TEMPLATE_BOOKING_REQUEST_CREATED_CONTACT = 'BOOKING_REQUEST_CREATED_CONTACT'
export const NOTIFICATION_TEMPLATE_BOOKING_REQUEST_CREATED_ADMIN = 'BOOKING_REQUEST_CREATED_ADMIN'

export const NOTIFICATION_TEMPLATE_TYPES = [
  NOTIFICATION_TEMPLATE_BOOKING_REQUEST_CREATED_CONTACT,
  NOTIFICATION_TEMPLATE_BOOKING_REQUEST_CREATED_ADMIN,
]


