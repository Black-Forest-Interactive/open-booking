import {Component, input} from '@angular/core';
import {DayInfoOffer} from "@open-booking/core";

@Component({
  selector: 'app-day-info-details-list-entry',
  imports: [],
  templateUrl: './day-info-details-list-entry.component.html',
  styleUrl: './day-info-details-list-entry.component.scss',
})
export class DayInfoDetailsListEntryComponent {
  data = input.required<DayInfoOffer>()
}
