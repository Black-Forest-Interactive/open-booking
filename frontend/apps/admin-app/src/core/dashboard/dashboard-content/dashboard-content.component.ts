import {Component, input, output} from '@angular/core';
import {Booking, ShowOffer} from "@open-booking/admin";
import {LoadingBarComponent} from "@open-booking/shared";
import {DashboardContentEntryComponent} from "../dashboard-content-entry/dashboard-content-entry.component";
import {MatIcon} from "@angular/material/icon";

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
  content = input.required<ShowOffer[]>()

  // Output
  clearFilter = output<boolean>()
  confirmBooking = output<Booking>()

  protected handleConfirmBooking(booking: Booking) {
    this.confirmBooking.emit(booking)
  }
}
