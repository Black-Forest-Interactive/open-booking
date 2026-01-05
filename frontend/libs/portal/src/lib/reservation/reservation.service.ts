import {Injectable} from "@angular/core";
import {BaseService, GenericRequestResult} from "@open-booking/shared";
import {Reservation, ResolvedResponse} from "@open-booking/core";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {CreateReservationRequest} from "./reservation.api";

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends BaseService {

  constructor(private translate: TranslateService) {
    super('portal/reservation')
  }

  createReservation(request: CreateReservationRequest): Observable<Reservation> {
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
