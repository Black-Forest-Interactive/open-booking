import {DayInfoOffer} from "./info.api";

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
