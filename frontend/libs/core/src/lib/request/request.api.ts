import {BookingInfo, VisitorGroup, VisitorGroupChangeRequest} from "@open-booking/core";

export interface BookingRequest {
  id: number,
  key: string,
  comment: string,
  status: string
}


export interface BookingRequestInfo {
  id: number,
  visitorGroup: VisitorGroup,
  bookings: BookingInfo[],
  status: string,
  comment: string,
  timestamp: string
}

export class BookingRequestChangeRequest {
  constructor(
    public visitorGroupChangeRequest: VisitorGroupChangeRequest,
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
    public visitorGroupStatus: string | null | undefined,
    public query: string | null | undefined
  ) {
  }
}
