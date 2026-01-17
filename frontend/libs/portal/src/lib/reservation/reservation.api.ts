import {Offer, ReservationStatus, Visitor, VisitorChangeRequest} from "@open-booking/core";

export class CreateReservationRequest {
  constructor(
    public visitor: VisitorChangeRequest,
    public offerId: number,
    public comment: string,
    public termsAndConditions: boolean
  ) {
  }
}


export interface PortalReservation {
  visitor: Visitor,
  offer: Offer,
  status: ReservationStatus,
  comment: string,
  timestamp: string
}
