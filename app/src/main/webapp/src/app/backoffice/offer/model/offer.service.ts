import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {Page} from "../../../shared/page/page";
import {Offer, OfferChangeRequest, OfferFilterRequest, OfferRangeRequest, OfferSeriesRequest} from "./offer-api";
import {GenericRequestResult} from "../../../shared/shared-api";
import * as moment from "moment";
import {Moment} from "moment";

@Injectable({
  providedIn: 'root'
})
export class OfferService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/offer', logging)
  }

  getAllOffer(page: number, size: number): Observable<Page<Offer>> {
    return this.getPaged('', page, size)
  }

  getOffer(id: number): Observable<Offer> {
    return this.get('' + id)
  }

  createOffer(request: OfferChangeRequest): Observable<Offer> {
    return this.post('', request)
  }

  updateOffer(id: number, request: OfferChangeRequest): Observable<Offer> {
    return this.put('' + id, request)
  }

  deleteOffer(id: number): Observable<Offer> {
    return this.delete('' + id)
  }


  createOfferSeries(request: OfferSeriesRequest): Observable<GenericRequestResult> {
    return this.post('series', request)
  }


  createOfferRange(request: OfferRangeRequest): Observable<GenericRequestResult> {
    return this.post('range', request)
  }


  findOfferByDate(date: string): Observable<Offer[]> {
    return this.get('find/' + date)
  }


  setOfferActive(id: number, active: boolean): Observable<Offer> {
    return this.patch('' + id + '/active', {value: active})
  }

  setOfferMaxPersons(id: number, value: number): Observable<Offer> {
    return this.patch('' + id + '/max_persons', {value: value})
  }

  createDateTime(timeStr: string, date: any): Moment | null {
    let mDate = moment(date)
    let time = timeStr.split(":");
    if (time.length == 2 && mDate.isValid()) {
      mDate.hours(parseInt(time[0]));
      mDate.minutes(parseInt(time[1]));
      return mDate
    }
    return null;
  }

  filter(request: OfferFilterRequest, page: number, size: number): Observable<Page<Offer>> {
    return this.postPaged('filter', request, page, size)
  }


}
