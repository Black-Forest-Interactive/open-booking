import {VisitorGroup} from "../../visitor-group/model/visitor-group-api";
import {defaultOffer, Offer} from "../../offer/model/offer-api";
import {defaultVisitorGroup} from "../../../visitor-group/model/visitor-group-api";

export interface Booking {
  id: number,
  offerId: number,
  visitorGroupId: number,
  size: number,
  status: string,
}

export const defaultBooking: Booking = {
  id: -1,
  offerId: -1,
  visitorGroupId: -1,
  size: -1,
  status: ""
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

export const defaultBookingDetails: BookingDetails = {
  booking: defaultBooking,
  visitorGroup: defaultVisitorGroup
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

export const defaultBookingSearchResult: BookingSearchResult = {
  offer: defaultOffer,
  booking: defaultBooking,
  visitorGroup: defaultVisitorGroup
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
