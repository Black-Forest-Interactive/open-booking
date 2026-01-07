import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {
  Reservation,
  ReservationChangeRequest,
  ReservationConfirmationContent,
  ReservationDetails,
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

  getReservationDetails(id: number): Observable<ReservationDetails> {
    return this.get('' + id + '/details')
  }

  getReservationInfo(id: number): Observable<ReservationInfo> {
    return this.get('' + id + '/info')
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

  getConfirmationMessage(id: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/confirm/message')
  }

  confirmReservation(id: number, content: ReservationConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/confirm', content)
  }

  getDenialMessage(id: number): Observable<ResolvedResponse> {
    return this.get('' + id + '/deny/message')
  }

  denyReservation(id: number, content: ReservationConfirmationContent): Observable<GenericRequestResult> {
    return this.put('' + id + '/deny', content)
  }

  updateVisitor(id: number, request: VisitorChangeRequest): Observable<GenericRequestResult> {
    return this.put(id + '/visitor', request)
  }

  setComment(id: number, comment: string): Observable<Reservation> {
    return this.patch(id + '/comment', {value: comment})
  }
}
