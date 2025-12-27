import {Component, input, output} from '@angular/core';
import {LoadingBarComponent} from "@open-booking/shared";
import {DashboardContentEntryComponent} from "../dashboard-content-entry/dashboard-content-entry.component";
import {MatIcon} from "@angular/material/icon";
import {BookingEntry, OfferEntry} from "@open-booking/core";

@Component({
  selector: 'app-dashboard-content',
  imports: [
    LoadingBarComponent,
    DashboardContentEntryComponent,
    MatIcon
  ],
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
})
export class DashboardContentComponent {

  // Input
  reloading = input.required<boolean>()
  content = input.required<OfferEntry[]>()

  // Output
  clearFilter = output<boolean>()
  confirmBooking = output<BookingEntry>()

  protected handleConfirmBooking(booking: BookingEntry) {
    this.confirmBooking.emit(booking)
  }
}
