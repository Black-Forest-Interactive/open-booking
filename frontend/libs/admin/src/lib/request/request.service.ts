import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {
  BookingConfirmationContent,
  BookingRequest,
  BookingRequestChangeRequest,
  BookingRequestFilterRequest,
  BookingRequestInfo,
  ResolvedResponse,
  VisitorGroupChangeRequest
} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class RequestService extends BaseService {

  constructor() {
    super('admin/request')
  }


  getAllBookingRequest(page: number, size: number): Observable<Page<BookingRequest>> {
    return this.getPaged('', page, size)
  }

  getBookingRequest(id: number): Observable<BookingRequest> {
    return this.get('' + id)
  }

  createBookingRequest(request: BookingRequestChangeRequest): Observable<BookingRequest> {
    return this.post('', request)
  }

  updateBookingRequest(id: number, request: BookingRequestChangeRequest): Observable<BookingRequest> {
    return this.put('' + id, request)
  }

  deleteBookingRequest(id: number): Observable<BookingRequest> {
    return this.delete('' + id)
  }

  getAllBookingRequestInfoUnconfirmed(page: number, size: number): Observable<Page<BookingRequestInfo>> {
    return this.getPaged('unconfirmed/info', page, size)
  }

  filterAllBookingRequestInfoUnconfirmed(filter: BookingRequestFilterRequest, page: number, size: number): Observable<Page<BookingRequestInfo>> {
    return this.postPaged('unconfirmed/info', filter, page, size)
  }

  getConfirmationMessage(id: number, bookingId: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/confirm/' + bookingId + '/message')
  }

  confirmBookingRequest(id: number, bookingId: number, content: BookingConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/confirm/' + bookingId, content)
  }

  getDenialMessage(id: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/deny/message')
  }

  denyBookingRequest(id: number, content: BookingConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/deny', content)
  }

  getInfoByBookingId(bookingId: number): Observable<BookingRequestInfo> {
    return this.get('info/by/booking/' + bookingId)
  }


  updateVisitorGroup(id: number, request: VisitorGroupChangeRequest): Observable<GenericRequestResult> {
    return this.put(id + '/visitor', request)
  }

  setComment(id: number, comment: string): Observable<BookingRequest> {
    return this.patch(id + '/comment', {value: comment})
  }
}
