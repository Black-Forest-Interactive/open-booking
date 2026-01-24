export interface Response {
  id: number,
  lang: string,
  type: string,
  title: string,
  content: string
}


export class ResponseChangeRequest {
  constructor(
    public lang: string,
    public type: string,
    public title: string,
    public content: string
  ) {
  }
}

export interface ResolvedResponse {
  title: string,
  content: string
}

export const defaultResolvedResponse: ResolvedResponse = {
  title: '',
  content: ''
}

export class Reference {
  constructor(
    public id: number,
    public type: string
  ) {
  }
}

export const ResponseType = {

  BOOKING_CONFIRM: 'BOOKING_CONFIRM',
  BOOKING_DECLINE: 'BOOKING_DECLINE',

  BOOKING_FAILED: 'BOOKING_FAILED',
  BOOKING_RECEIVED: 'BOOKING_RECEIVED',

  RESERVATION_RECEIVED: 'RESERVATION_RECEIVED',
  RESERVATION_FAILED: 'RESERVATION_FAILED',

  RESERVATION_CONFIRMED: 'RESERVATION_CONFIRMED',
  RESERVATION_DENIED: 'RESERVATION_DENIED'
} as const

export type ResponseType = typeof ResponseType[keyof typeof ResponseType]
