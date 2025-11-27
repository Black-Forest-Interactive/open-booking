import {Component, Input} from '@angular/core';
import {BookingRequestInfo, defaultBookingRequestInfo} from "../../request/model/booking-request-api";

@Component({
  selector: 'app-booking-details-header',
  templateUrl: './booking-details-header.component.html',
  styleUrls: ['./booking-details-header.component.scss']
})
export class BookingDetailsHeaderComponent {
  @Input() data: BookingRequestInfo = defaultBookingRequestInfo
}
