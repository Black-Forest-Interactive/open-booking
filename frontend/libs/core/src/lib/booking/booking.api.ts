import {Visitor, VisitorChangeRequest} from "../visitor/visitor.api";
import {Offer} from "../offer/offer.api";

export class CreateBookingRequest {
  constructor(
    public visitorChangeRequest: VisitorChangeRequest,
    public offerIds: number[],
    public comment: string,
    public termsAndConditions: boolean
  ) {
  }
}

export interface Booking {
  id: number,
  status: string,
  size: number,
  comment: string,
  offerId: number,
  visitorId: number,
}

export class BookingChangeRequest {
  constructor(
    public offerId: number,
    public visitorId: number,
    public comment: string,
  ) {
  }
}


export interface BookingDetails {
  booking: Booking,
  visitor: Visitor
}

export class BookingSearchRequest {
  constructor(
    public query: string
  ) {
  }
}

export interface BookingSearchResult {
  offer: Offer,
  booking: Booking,
  visitor: Visitor
}


export interface BookingInfo {
  id: number,
  offer: Offer,
  spaceAvailable: number,
  spaceConfirmed: number,
  status: string,
  timestamp: string
}
