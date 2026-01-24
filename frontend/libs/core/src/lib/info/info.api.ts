import type {Assignment, Offer} from "../offer/offer.api";

export interface DayInfo {
  date: string,
  start: string,
  end: string,
  offer: DayInfoOffer[]
}

export const defaultDayInfo: DayInfo = {
  date: "",
  start: "",
  end: "",
  offer: []
}

export class DateRangeSelectionRequest {
  public constructor(
    public from: string,
    public to: string
  ) {
  }
}

export interface DayInfoOffer {
  offer: Offer,
  assignment: Assignment,
  claimedUntil: string | undefined,
  bookings: DayInfoBooking[]
}

export interface DayInfoBooking {
  size: number,
  status: string,
}

