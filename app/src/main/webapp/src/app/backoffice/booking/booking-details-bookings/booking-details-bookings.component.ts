import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookingRequestInfo, defaultBookingRequestInfo} from "../../request/model/booking-request-api";
import {BookingInfo} from "../model/booking-api";
import {BookingRequestService} from "../../request/model/booking-request.service";

@Component({
  selector: 'app-booking-details-bookings',
  templateUrl: './booking-details-bookings.component.html',
  styleUrls: ['./booking-details-bookings.component.scss']
})
export class BookingDetailsBookingsComponent {
  @Input() data: BookingRequestInfo = defaultBookingRequestInfo
  @Output() change = new EventEmitter<Boolean>()

  constructor(private service: BookingRequestService) {
  }

  confirm(booking: BookingInfo) {
    this.service.confirmBooking(booking, this.data).subscribe( result => {if(result) this.change.emit(true)})
  }

  denial(booking: BookingInfo) {
    this.service.denialBooking(booking, this.data).subscribe( result => {if(result) this.change.emit(true)})
  }
}
