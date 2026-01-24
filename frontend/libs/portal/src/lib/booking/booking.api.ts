import {BookingStatus, Offer, ResolvedResponse, Visitor, VisitorChangeRequest} from "@open-booking/core";

export class CreateBookingRequest {
  constructor(
    public visitor: VisitorChangeRequest,
    public offerId: number,
    public comment: string,
    public termsAndConditions: boolean
  ) {
  }
}

export interface CreateBookingResponse {
  success: boolean,
  response: ResolvedResponse,
}

export interface PortalBooking {
  visitor: Visitor,
  offer: Offer,
  status: BookingStatus,
  comment: string,
  timestamp: string
}
