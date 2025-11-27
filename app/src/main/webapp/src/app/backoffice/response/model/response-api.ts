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

export const RESPONSE_TYPE_BOOKING_REQUEST_RECEIVED = 'BOOKING_REQUEST_RECEIVED'
export const RESPONSE_TYPE_BOOKING_CONFIRMED = 'BOOKING_CONFIRMED'
export const RESPONSE_TYPE_BOOKING_DENIED = 'BOOKING_DENIED'

export const RESPONSE_TYPES = [
  RESPONSE_TYPE_BOOKING_REQUEST_RECEIVED,
  RESPONSE_TYPE_BOOKING_CONFIRMED,
  RESPONSE_TYPE_BOOKING_DENIED
]

