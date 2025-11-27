import {Injectable} from '@angular/core';
import {BaseService} from "../../shared/base-service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LoggingService} from "../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {DayInfoOffer} from "../../offer/model/offer-api";
import {ResolvedResponse} from "../../backoffice/response/model/response-api";
import {CreateBookingRequest, TextResponse, UrlResponse} from "./home-api";
import {GenericRequestResult} from "../../shared/shared-api";
import {BookingRequest} from "../../backoffice/request/model/booking-request-api";
import {Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService {
  constructor(http: HttpClient, logging: LoggingService, private pageTitle: Title) {
    super(http, 'frontend/user', logging)
    this.retryCount = 1
    this.getTitle().subscribe(d => {
      this.pageTitle.setTitle(d.text)
      this.title = d.text
    })
  }

  title: string = 'APP.Title'


  getOffer(offerId: number): Observable<DayInfoOffer> {
    return this.get('offer/' + offerId)
  }

  createBooking(request: CreateBookingRequest): Observable<BookingRequest> {
    return super.post('booking', request)
  }

  getRequestReceivedMessage(requestId: number, lang: string): Observable<ResolvedResponse> {
    let queryParams = new HttpParams()
    queryParams = queryParams.append("lang", lang)
    return this.get('request/' + requestId + '/received/message', queryParams)
  }

  getRequestFailedMessage(requestId: number, lang: string): Observable<ResolvedResponse> {
    let queryParams = new HttpParams()
    queryParams = queryParams.append("lang", lang)
    return this.get('request/' + requestId + '/failed/message', queryParams)
  }

  getHelpUrl(): Observable<UrlResponse> {
    return this.get('setting/help')
  }

  getTermsAndConditionsUrl(): Observable<UrlResponse> {
    return this.get('setting/terms-and-conditions')
  }

  getTitle(): Observable<TextResponse> {
    return this.get('setting/title')
  }


  confirmEmail(key: string): Observable<GenericRequestResult> {
    return this.post('confirm/email/' + key, {})
  }
}
