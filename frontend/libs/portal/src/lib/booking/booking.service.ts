import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult} from "@open-booking/shared";
import {BookingRequest, CreateBookingRequest, ResolvedResponse} from "@open-booking/core";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {

  constructor(private translate: TranslateService) {
    super('portal/booking')
  }

  createBooking(request: CreateBookingRequest): Observable<BookingRequest> {
    return super.post('', request)
  }

  getRequestReceivedMessage(requestId: number): Observable<ResolvedResponse> {
    let queryParams = new HttpParams()
    queryParams = queryParams.append("lang", this.translate.getCurrentLang())
    return this.get('request/' + requestId + '/received/message', queryParams)
  }

  getRequestFailedMessage(requestId: number): Observable<ResolvedResponse> {
    let queryParams = new HttpParams()
    queryParams = queryParams.append("lang", this.translate.getCurrentLang())
    return this.get('request/' + requestId + '/failed/message', queryParams)
  }

  confirmEmail(key: string): Observable<GenericRequestResult> {
    return this.post('confirm/email/' + key, {})
  }
}
