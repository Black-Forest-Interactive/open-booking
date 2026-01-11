import {Assignment, Offer, OfferInfo, Visitor, VisitorChangeRequest} from "@open-booking/core";
import {Page} from "@open-booking/shared";

export interface Reservation {
  id: number,
  key: string,
  comment: string,
  status: ReservationStatus,
  visitorId: number,
  offerId: number
}

export interface ReservationInfo {
  id: number,
  visitor: Visitor,
  offer: OfferInfo,
  status: string,
  comment: string,
  timestamp: string
}

export interface ReservationDetails {
  reservation: Reservation,
  visitor: Visitor,
  offer: ReservationOffer,
  timestamp: string
}

export interface ReservationOffer {
  offer: Offer,
  assignment: Assignment,
}


export class ReservationChangeRequest {
  constructor(
    public visitor: VisitorChangeRequest,
    public comment: string,
    public offerId: number,
    public autoConfirm: Boolean,
    public ignoreSizeCheck: Boolean
  ) {
  }
}

export class ReservationConfirmationContent {
  constructor(
    public subject: string,
    public content: string,
    public silent: boolean
  ) {
  }
}

export class ReservationSearchRequest {
  constructor(
    public fullTextSearch: String,
    public status: ReservationStatus[],
    public from: string | null | undefined,
    public to: string | null | undefined
  ) {
  }
}

export interface ReservationSearchResponse {
  result: Page<ReservationDetails>
}


export const ReservationStatus = {
  UNKNOWN: 'UNKNOWN',
  UNCONFIRMED: 'UNCONFIRMED',
  CONFIRMED: 'CONFIRMED',
  DENIED: 'DENIED',
  EXPIRED: 'EXPIRED'
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus]
