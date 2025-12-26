import {Offer} from "@open-booking/core";

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
  space: any,
  bookings: DayInfoBooking[]
}

export interface DayInfoBooking {
  size: number,
  status: string,
}

