import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {
  Booking,
  BookingChangeRequest,
  BookingConfirmationContent,
  BookingDetails,
  BookingInfo,
  BookingSearchRequest,
  BookingSearchResponse,
  Editor,
  ResolvedResponse,
  VisitorChangeRequest
} from "@open-booking/core";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {

  constructor() {
    super('admin/booking')
  }

  getAllBooking(page: number, size: number): Observable<Page<Booking>> {
    return this.getPaged('', page, size)
  }

  getBooking(id: number): Observable<Booking> {
    return this.get('' + id)
  }

  getBookingDetails(id: number): Observable<BookingDetails> {
    return this.get('' + id + '/details')
  }

  getBookingInfo(id: number): Observable<BookingInfo> {
    return this.get('' + id + '/info')
  }

  searchBooking(request: BookingSearchRequest, page: number, size: number): Observable<BookingSearchResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
    return this.post('search', request, params)
  }

  createBooking(request: BookingChangeRequest): Observable<Booking> {
    return this.post('', request)
  }

  updateBooking(id: number, request: BookingChangeRequest): Observable<Booking> {
    return this.put('' + id, request)
  }

  deleteBooking(id: number): Observable<Booking> {
    return this.delete('' + id)
  }

  confirmBooking(id: number, content: BookingConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/confirm', content)
  }

  getConfirmResponse(id: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/confirm/response')
  }

  declineBooking(id: number, content: BookingConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/decline', content)
  }

  getDeclineResponse(id: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/decline/response')
  }

  updateVisitor(id: number, request: VisitorChangeRequest): Observable<GenericRequestResult> {
    return this.put(id + '/visitor', request)
  }

  setComment(id: number, comment: string): Observable<Booking> {
    return this.patch(id + '/comment', {value: comment})
  }

  getPendingAmount(): Observable<number> {
    return this.get('pending/amount')
  }

  createEditor(id: number): Observable<Editor> {
    return this.post(id + '/editor', {})
  }

  deleteEditor(id: number): Observable<Editor> {
    return this.delete(id + '/editor')
  }

  getEditor(id: number): Observable<Editor> {
    return this.get(id + '/editor')
  }

  refreshEditor(id: number): Observable<Editor> {
    return this.put(id + '/editor', {})
  }


  findBookingDetailsByOffer(offerId: number): Observable<BookingDetails[]> {
    return this.get('by/offer/' + offerId + '/details')
  }

}
