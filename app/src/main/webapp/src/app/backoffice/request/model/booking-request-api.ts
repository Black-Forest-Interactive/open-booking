import {defaultVisitorGroup, VisitorGroup, VisitorGroupChangeRequest} from "../../../visitor-group/model/visitor-group-api";
import {BookingInfo} from "../../booking/model/booking-api";

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

export const defaultBookingRequestInfo: BookingRequestInfo = {
  id: -1,
  visitorGroup: defaultVisitorGroup,
  bookings: [],
  status: "",
  comment: "",
  timestamp: ""
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
