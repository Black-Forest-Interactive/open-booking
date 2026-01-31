import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {
  Guide,
  Label,
  Offer,
  OfferChangeDurationRequest,
  OfferChangeRequest,
  OfferFindSuitableRequest,
  OfferFindSuitableResponse,
  OfferGroupedSearchResult,
  OfferInfo,
  OfferRangeRequest,
  OfferRedistributeRequest,
  OfferSearchRequest,
  OfferSearchResponse,
  OfferSeriesRequest
} from "@open-booking/core";
import {DateTime} from "luxon";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OfferService extends BaseService {

  constructor() {
    super('admin/offer')
  }

  getAllOffer(page: number, size: number): Observable<Page<Offer>> {
    return this.getPaged('', page, size)
  }

  getAllOfferInfo(page: number, size: number): Observable<Page<OfferInfo>> {
    return this.getPaged('info', page, size)
  }

  getOffer(id: number): Observable<Offer> {
    return this.get('' + id)
  }

  searchOffer(request: OfferSearchRequest, page: number, size: number): Observable<OfferSearchResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
    return this.post('search', request, params)
  }

  findOffer(request: OfferFindSuitableRequest): Observable<OfferFindSuitableResponse> {
    return this.post('find', request)
  }

  searchOfferGroupedByDay(request: OfferSearchRequest): Observable<OfferGroupedSearchResult[]> {
    return this.post('search/by/day', request)
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

  setOfferLabel(id: number, label: Label | undefined): Observable<Offer> {
    return this.patch('' + id + '/label', {value: label?.id ?? -1})
  }

  setOfferGuide(id: number, guide: Guide | undefined): Observable<Offer> {
    return this.patch('' + id + '/guide', {value: guide?.id ?? -1})
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

  redistributeOffer(request: OfferRedistributeRequest): Observable<GenericRequestResult> {
    return this.post('redistribute', request)
  }

  relabelOffer(date: string): Observable<GenericRequestResult> {
    return this.post('relabel/' + date, {})
  }


  changeDuration(request: OfferChangeDurationRequest): Observable<GenericRequestResult> {
    return this.post('change_duration', request)
  }


  createDateTime(timeStr: string, date: DateTime): DateTime | null {
    let time = timeStr.split(":")
    if (time.length == 2 && date.isValid) {
      date = date.set({
        hour: parseInt(time[0]),
        minute: parseInt(time[1])
      })
      return date
    }
    return null
  }

}
