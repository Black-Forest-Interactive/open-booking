import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult} from "@open-booking/shared";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {CreateBookingRequest, CreateBookingResponse, PortalBooking} from "./booking.api";

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

  getBooking(key: string): Observable<PortalBooking> {
    let param = new HttpParams().append("key", key)
    return this.get('', param)
  }
}
