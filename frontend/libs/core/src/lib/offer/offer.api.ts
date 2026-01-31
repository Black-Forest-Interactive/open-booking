import type {Label} from "../label/label.api";
import type {Guide} from "../guide/guide.api";
import type {BookingDetails} from "../booking/booking.api";
import type {ReservationInfo} from "../reserveration/reservation.api";
import type {Page} from "@open-booking/shared";

export interface Offer {
  id: number,
  start: string,
  finish: string,
  maxPersons: number,
  active: boolean,
  created: string,
  updated: string | undefined,
}

export interface OfferInfo {
  offer: Offer,
  label: Label | undefined,
  guide: Guide | undefined
}

export interface OfferDetails {
  offer: Offer,
  assignment: Assignment,
  bookings: BookingDetails[],
  reservations: ReservationInfo[],
  timestamp: string
}

export interface OfferReference {
  offer: Offer,
  assignment: Assignment,
}

export interface Assignment {
  confirmedSpace: number,
  pendingSpace: number,
  availableSpace: number,
  deactivatedSpace: number,
}

export class OfferChangeRequest {
  constructor(
    public start: string,
    public finish: string,
    public maxPersons: number,
    public active: boolean,
    public labelId: number | null,
    public guideId: number | null
  ) {
  }
}

export class OfferSeriesRequest {
  constructor(
    public maxPersons: number,
    public start: string,
    public duration: string,
    public interval: string,
    public quantity: number,
    public minTime: string,
    public maxTime: string,
  ) {
  }
}

export class OfferRangeRequest {
  constructor(
    public maxPersons: number,
    public dateFrom: string,
    public dateTo: string,
    public timeFrom: string,
    public timeTo: string,
    public duration: string,
    public interval: string
  ) {
  }
}

export class OfferRedistributeRequest {
  constructor(
    public date: string,
    public timeFrom: string,
    public timeTo: string,
    public duration: string
  ) {
  }
}

export class OfferChangeDurationRequest {
  constructor(
    public dateFrom: string,
    public dateTo: string,
    public timeFrom: string,
    public timeTo: string,
    public duration: string,
  ) {
  }
}

export class OfferSearchRequest {
  constructor(
    public fullTextSearch: string,
    public from: string | null | undefined,
    public to: string | null | undefined,
  ) {
  }
}

export interface OfferSearchResponse {
  result: Page<OfferSearchEntry>
}

export interface OfferGroupedSearchResult {
  day: string,
  entries: OfferSearchEntry[]
}


export interface OfferSearchEntry {
  info: OfferInfo,
  assignment: Assignment,
  bookings: BookingDetails[]
}

export class OfferFindSuitableRequest {
  constructor(
    public from: string | null | undefined,
    public to: string | null | undefined,
    public visitorSize: number
  ) {
  }
}

export interface OfferFindSuitableResponse {
  entries: OfferFindSuitableResponseEntry[]
}

export interface OfferFindSuitableResponseEntry {
  day: string,
  entries: OfferReference[]
}
