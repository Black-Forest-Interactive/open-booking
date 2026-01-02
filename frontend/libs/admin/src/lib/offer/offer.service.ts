import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {
  Offer,
  OfferChangeRequest,
  OfferFilterRequest,
  OfferInfo,
  OfferRangeRequest,
  OfferSeriesRequest
} from "@open-booking/core";
import {DateTime} from "luxon";

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

  filter(request: OfferFilterRequest, page: number, size: number): Observable<Page<Offer>> {
    return this.postPaged('filter', request, page, size)
  }


  filterInfo(request: OfferFilterRequest, page: number, size: number): Observable<Page<OfferInfo>> {
    return this.postPaged('filter/info', request, page, size)
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
