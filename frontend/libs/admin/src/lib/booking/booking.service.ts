import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {Booking, BookingChangeRequest, BookingDetails} from "@open-booking/core";

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

}
