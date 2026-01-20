import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult} from "@open-booking/shared";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {CreateBookingRequest, CreateBookingResponse, PortalBooking} from "./booking.api";
import {Booking, VisitorResizeRequest} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {

  constructor(private translate: TranslateService) {
    super('portal/booking')
  }

  createBooking(request: CreateBookingRequest): Observable<CreateBookingResponse> {
    let params = new HttpParams().append("lang", this.translate.getCurrentLang())
    return super.post('', request, params)
  }

  confirmEmail(key: string): Observable<GenericRequestResult> {
    let param = new HttpParams().append("key", key)
    return this.post('confirm/email', {}, param)
  }


  updateComment(key: string, value: string): Observable<Booking> {
    let param = new HttpParams().append("key", key)
    return this.post('comment', {value: value}, param)
  }

  updateSize(key: string, request: VisitorResizeRequest): Observable<Booking> {
    let param = new HttpParams().append("key", key)
    return this.post('size', request, param)
  }

  updatePhone(key: string, size: number): Observable<Booking> {
    let param = new HttpParams().append("key", key)
    return this.post('phone', {value: size}, param)
  }

  updateEmail(key: string, size: number): Observable<Booking> {
    let param = new HttpParams().append("key", key)
    return this.post('email', {value: size}, param)
  }

  getBooking(key: string): Observable<PortalBooking> {
    let param = new HttpParams().append("key", key)
    return this.get('', param)
  }

  cancelBooking(key: string): Observable<GenericRequestResult> {
    let param = new HttpParams().append("key", key)
    return this.delete('', param)
  }


}
