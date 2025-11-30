import {Component, input} from '@angular/core';
import {DayInfo} from "@open-booking/portal";
import {DayInfoDetailsListEntryComponent} from "../day-info-details-list-entry/day-info-details-list-entry.component";

@Component({
  selector: 'app-day-info-details-list',
  imports: [
    DayInfoDetailsListEntryComponent
  ],
  templateUrl: './day-info-details-list.component.html',
  styleUrl: './day-info-details-list.component.scss',
})
export class DayInfoDetailsListComponent {
  data = input.required<DayInfo>()
}
