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


export class DayInfoHelper {
  static getSpaceAvailable(info: DayInfoOffer | undefined): number {
    if (!info) return 0
    let result = (info.offer.active) ? info.offer.maxPersons - info.space.CONFIRMED - info.space.UNCONFIRMED : 0
    if (result < 0) return 0
    if (result > info.offer.maxPersons) return info.offer.maxPersons
    return result
  }

  static getSpaceConfirmed(info: DayInfoOffer): number {
    let result = (info.offer.active) ? info.space.CONFIRMED : 0
    if (result < 0) return 0
    if (result > info.offer.maxPersons) return info.offer.maxPersons
    return result
  }

  static getSpaceUnconfirmed(info: DayInfoOffer): number {
    let result = (info.offer.active) ? info.space.UNCONFIRMED : 0
    if (result < 0) return 0
    if (result > info.offer.maxPersons) return info.offer.maxPersons
    return result
  }
}
