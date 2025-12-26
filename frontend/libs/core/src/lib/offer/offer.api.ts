export interface Offer {
  id: number,
  start: string,
  finish: string,
  maxPersons: number,
  active: boolean
}


export class OfferChangeRequest {
  constructor(
    public start: string,
    public finish: string,
    public maxPersons: number,
    public active: boolean
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

export class OfferFilterRequest {
  constructor(
    public from: string | null | undefined,
    public to: string | null | undefined,
    public active: boolean | null | undefined,
  ) {
  }
}
