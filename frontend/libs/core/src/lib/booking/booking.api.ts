import type {Visitor, VisitorChangeRequest} from "../visitor/visitor.api";
import type {OfferInfo, OfferReference} from "../offer/offer.api";
import type {Editor} from "../editor/editor.api";
import type {Page} from "@open-booking/shared";

export interface Booking {
  id: number,
  key: string,
  status: BookingStatus,
  size: number,
  comment: string,
  lang: string,
  offerId: number,
  visitorId: number,
  created: string,
  updated: string | undefined,
}

export interface BookingDetails {
  booking: Booking,
  visitor: Visitor,
  offer: OfferReference,
  timestamp: string,
  editor: Editor | undefined
}

export interface BookingInfo {
  id: number,
  visitor: Visitor,
  offer: OfferInfo,
  status: BookingStatus,
  comment: string,
  timestamp: string
}


export class BookingChangeRequest {
  constructor(
    public visitor: VisitorChangeRequest,
    public comment: string,
    public lang: string,
    public offerId: number,
    public autoConfirm: boolean,
    public ignoreSizeCheck: boolean,
    public noCreateNotification: boolean,
  ) {
  }
}

export class BookingSearchRequest {
  constructor(
    public fullTextSearch: String,
    public status: BookingStatus[],
    public from: string | null | undefined,
    public to: string | null | undefined,
    public onlyMailConfirmed: boolean | null
  ) {
  }
}

export interface BookingSearchResponse {
  result: Page<BookingDetails>,
  status: BookingStatusCount
}

export type BookingStatusCount = Partial<Record<BookingStatus, number>>


export const BookingStatus = {
  UNKNOWN: 'UNKNOWN',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus]

