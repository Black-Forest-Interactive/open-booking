import {Offer} from "../../backoffice/offer/model/offer-api";
import {DayInfoBooking} from "../../backoffice/booking/model/booking-api";

export interface OfferInfoSelectResultEntry {
  date: string,
  infos: DayInfoOffer[]
}

export interface DayInfoOffer {

  offer: Offer,
  space: any,
  bookings: DayInfoBooking[]
}

export class DayInfoHelper {
  static getSpaceAvailable(info: DayInfoOffer): number {
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

export class OfferInfoSelectRequest {
  public constructor(
    public groupSize: number,
    public dates: string[]
  ) {
  }
}


