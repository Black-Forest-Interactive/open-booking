export interface NotificationTemplate {
  id: number,
  lang: string,
  type: NotificationTemplateType,
  subject: string,
  content: string
}

export class NotificationTemplateChangeRequest {
  constructor(
    public lang: string,
    public type: NotificationTemplateType,
    public subject: string,
    public content: string
  ) {
  }
}

export const NotificationTemplateType = {
  RESERVATION_CREATED_CONTACT: 'RESERVATION_CREATED_CONTACT',
  RESERVATION_CREATED_ADMIN: 'RESERVATION_CREATED_ADMIN',

  BOOKING_CREATED_CONTACT: 'BOOKING_CREATED_CONTACT',
  BOOKING_CREATED_ADMIN: 'BOOKING_CREATED_ADMIN',
  BOOKING_CHANGED_CONTACT: 'BOOKING_CHANGED_CONTACT',
  BOOKING_CHANGED_ADMIN: 'BOOKING_CHANGED_ADMIN',

} as const

export type NotificationTemplateType = typeof NotificationTemplateType[keyof typeof NotificationTemplateType]
