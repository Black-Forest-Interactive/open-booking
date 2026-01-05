import {Component, input, output} from '@angular/core';
import {LoadingBarComponent} from "@open-booking/shared";
import {DashboardContentEntryComponent} from "../dashboard-content-entry/dashboard-content-entry.component";
import {MatIcon} from "@angular/material/icon";
import {OfferReservationEntry, OfferSearchEntry} from "@open-booking/core";

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
  content = input.required<OfferSearchEntry[]>()

  // Output
  clearFilter = output<boolean>()
  confirmReservation = output<OfferReservationEntry>()

  protected handleConfirmReservation(reservation: OfferReservationEntry) {
    this.confirmReservation.emit(reservation)
  }
}
