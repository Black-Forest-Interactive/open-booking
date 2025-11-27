import {DayInfoOffer} from "../../offer/model/offer-api";
import {Offer} from "../../backoffice/offer/model/offer-api";

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


export class OfferSelectionEntry {
  public constructor(
    public date: string,
    public offer: Offer | undefined
  ) {
  }
}
