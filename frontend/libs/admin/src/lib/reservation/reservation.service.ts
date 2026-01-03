import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {
  BookingConfirmationContent,
  Reservation,
  ReservationChangeRequest,
  ReservationFilterRequest,
  ReservationInfo,
  ReservationSearchRequest,
  ReservationSearchResponse,
  ResolvedResponse,
  VisitorChangeRequest
} from "@open-booking/core";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends BaseService {

  constructor() {
    super('admin/reservation')
  }

  getAllReservation(page: number, size: number): Observable<Page<Reservation>> {
    return this.getPaged('', page, size)
  }

  getReservation(id: number): Observable<Reservation> {
    return this.get('' + id)
  }

  searchReservation(request: ReservationSearchRequest, page: number, size: number): Observable<ReservationSearchResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
    return this.post('search', request, params)
  }

  createReservation(request: ReservationChangeRequest): Observable<Reservation> {
    return this.post('', request)
  }

  updateReservation(id: number, request: ReservationChangeRequest): Observable<Reservation> {
    return this.put('' + id, request)
  }

  deleteReservation(id: number): Observable<Reservation> {
    return this.delete('' + id)
  }

  getAllReservationInfoUnconfirmed(page: number, size: number): Observable<Page<ReservationInfo>> {
    return this.getPaged('unconfirmed/info', page, size)
  }

  filterAllReservationInfoUnconfirmed(filter: ReservationFilterRequest, page: number, size: number): Observable<Page<ReservationInfo>> {
    return this.postPaged('unconfirmed/info', filter, page, size)
  }

  getConfirmationMessage(id: number, bookingId: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/confirm/' + bookingId + '/message')
  }

  confirmReservation(id: number, bookingId: number, content: BookingConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/confirm/' + bookingId, content)
  }

  getDenialMessage(id: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/deny/message')
  }

  denyReservation(id: number, content: BookingConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/deny', content)
  }

  getInfoByBookingId(bookingId: number): Observable<ReservationInfo> {
    return this.get('info/by/booking/' + bookingId)
  }


  updateVisitor(id: number, request: VisitorChangeRequest): Observable<GenericRequestResult> {
    return this.put(id + '/visitor', request)
  }

  setComment(id: number, comment: string): Observable<Reservation> {
    return this.patch(id + '/comment', {value: comment})
  }
}
