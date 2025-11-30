import {Offer} from '@open-booking/core'

export interface DashboardEntry {
  date: string,
  start: string,
  end: string,
  offer: DashboardEntryOffer[]
}

export interface DashboardEntryOffer {
  start: string,
  spaceAvailable: number,
  spaceConfirmed: number,
  spaceUnconfirmed: number,
  spaceDeactivated: number
}


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
