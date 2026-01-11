import {Component, input, output} from '@angular/core';
import {ReservationDetails} from "@open-booking/core";
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
  entries = input.required<ReservationDetails[]>()
  reload = output<boolean>()

}
