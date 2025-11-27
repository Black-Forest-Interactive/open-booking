import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {Page} from "../../../shared/page/page";
import {Booking, BookingChangeRequest, BookingDetails, BookingSearchRequest, BookingSearchResult} from "./booking-api";

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/booking', logging)
  }


  getAllBooking(page: number, size: number): Observable<Page<Booking>> {
    return this.getPaged('', page, size)
  }

  getBooking(id: number): Observable<Booking> {
    return this.get('' + id)
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

  findBookingsByOffer(offerId: number): Observable<Booking[]> {
    return this.get('by/offer/' + offerId)
  }

  findBookingDetailsByOffer(offerId: number): Observable<BookingDetails[]> {
    return this.get('by/offer/' + offerId + '/details')
  }

  searchBookingDetails(request: BookingSearchRequest, page: number, size: number): Observable<Page<BookingSearchResult>> {
    return this.postPaged('search', request, page, size)
  }
}
