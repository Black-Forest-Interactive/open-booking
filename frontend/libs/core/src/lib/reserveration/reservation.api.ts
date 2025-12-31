import {Offer, Visitor, VisitorChangeRequest} from "@open-booking/core";

export interface Reservation {
  id: number,
  key: string,
  comment: string,
  status: string
}

export interface ReservationInfo {
  id: number,
  visitor: Visitor,
  offer: Offer[],
  status: string,
  comment: string,
  timestamp: string
}

export class ReservationChangeRequest {
  constructor(
    public visitor: VisitorChangeRequest,
    public comment: string,
    public offerIds: number[],
    public autoConfirm: Boolean,
    public ignoreSizeCheck: Boolean
  ) {
  }
}

export class ReservationFilterRequest {
  constructor(
    public offerDate: string | null | undefined,
    public visitorStatus: string | null | undefined,
    public query: string | null | undefined
  ) {
  }
}
