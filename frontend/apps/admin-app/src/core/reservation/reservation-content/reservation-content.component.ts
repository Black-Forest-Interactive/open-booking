import {Component, input} from '@angular/core';
import {ReservationSearchEntry} from "@open-booking/core";
import {ReservationContentEntryComponent} from "../reservation-content-entry/reservation-content-entry.component";

@Component({
  selector: 'app-reservation-content',
  imports: [
    ReservationContentEntryComponent
  ],
  templateUrl: './reservation-content.component.html',
  styleUrl: './reservation-content.component.scss',
})
export class ReservationContentComponent {
  reloading = input(false)
  entries = input.required<ReservationSearchEntry[]>()

}
