import {Component, Input} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailsInfoDialogComponent} from "../booking-details-info-dialog/booking-details-info-dialog.component";
import {defaultOffer, Offer} from "../../../backoffice/offer/model/offer-api";
import {BookingDetails} from "../../../backoffice/booking/model/booking-api";
import {BookingService} from "../../../backoffice/booking/model/booking.service";

@Component({
  selector: 'app-booking-admin-day-entry',
  templateUrl: './booking-admin-day-entry.component.html',
  styleUrls: ['./booking-admin-day-entry.component.scss']
})
export class BookingAdminDayEntryComponent {
  reloading: boolean = false
  @Input() offer: Offer = defaultOffer

  bookings: BookingDetails[] = []

  constructor(private service: BookingService, private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.offer) {
      this.reloading = true
      this.service.findBookingDetailsByOffer(this.offer.id).subscribe(d => this.handleData(d))
    }
  }

  private handleData(d: BookingDetails[]) {
    this.bookings = d
    this.reloading = false
  }

  showDetails(b: BookingDetails) {
    this.dialog.open(BookingDetailsInfoDialogComponent, {data: b})
  }
}
