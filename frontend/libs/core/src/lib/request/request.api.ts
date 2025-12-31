import {BookingInfo, Visitor, VisitorChangeRequest} from "@open-booking/core";

export interface BookingRequest {
  id: number,
  key: string,
  comment: string,
  status: string
}


export interface BookingRequestInfo {
  id: number,
  visitor: Visitor,
  bookings: BookingInfo[],
  status: string,
  comment: string,
  timestamp: string
}

export class BookingRequestChangeRequest {
  constructor(
    public visitorChangeRequest: VisitorChangeRequest,
    public offerIds: number[],
    public comment: string,
    public autoConfirm: boolean,
    public ignoreSizeCheck: boolean
  ) {
  }
}

export class BookingConfirmationContent {
  constructor(
    public subject: string,
    public content: string,
    public silent: boolean
  ) {
  }
}

export class BookingRequestFilterRequest {
  constructor(
    public offerDate: string | null | undefined,
    public visitorStatus: string | null | undefined,
    public query: string | null | undefined
  ) {
  }
}
