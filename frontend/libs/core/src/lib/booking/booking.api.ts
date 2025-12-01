import {VisitorGroup, VisitorGroupChangeRequest} from "../group/group.api";
import {Offer} from "../offer/offer.api";

export class CreateBookingRequest {
  constructor(
    public visitorGroupChangeRequest: VisitorGroupChangeRequest,
    public offerIds: number[],
    public comment: string,
    public termsAndConditions: boolean
  ) {
  }
}

export interface Booking {
  id: number,
  offerId: number,
  visitorGroupId: number,
  size: number,
  status: string,
}

export class BookingChangeRequest {
  constructor(
    public offerId: number,
    public visitorGroupId: number,
  ) {
  }
}


export interface BookingDetails {
  booking: Booking,
  visitorGroup: VisitorGroup
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
  visitorGroup: VisitorGroup
}


export interface BookingInfo {
  id: number,
  offer: Offer,
  spaceAvailable: number,
  spaceConfirmed: number,
  status: string,
  timestamp: string
}

export interface DayInfoBooking {
  size: number,
  status: string,
}
