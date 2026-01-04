import {Assignment, Offer, Visitor, VisitorChangeRequest} from "@open-booking/core";
import {Page} from "@open-booking/shared";

export interface Reservation {
  id: number,
  key: string,
  comment: string,
  status: ReservationStatus
}

export interface ReservationInfo {
  id: number,
  visitor: Visitor,
  offer: ReservationOfferReference[],
  status: string,
  comment: string,
  timestamp: string
}

export interface ReservationDetails {
  reservation: Reservation,
  visitor: Visitor,
  offers: ReservationOfferEntry[],
  timestamp: string
}

export interface ReservationOfferEntry {
  offer: Offer,
  assignment: Assignment,
  priority: number
}

export interface ReservationOfferReference {
  offerId: number,
  priority: number
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
    public fullTextSearch: String
  ) {
  }
}

export interface ReservationSearchResponse {
  result: Page<ReservationSearchEntry>
}

export interface ReservationSearchEntry {
  reservation: Reservation,
  visitor: Visitor,
  offers: ReservationOfferEntry[],
  timestamp: string
}

export const ReservationStatus = {
  UNKNOWN: 'UNKNOWN',
  UNCONFIRMED: 'UNCONFIRMED',
  CONFIRMED: 'CONFIRMED',
  DENIED: 'DENIED',
  EXPIRED: 'EXPIRED'
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus]
