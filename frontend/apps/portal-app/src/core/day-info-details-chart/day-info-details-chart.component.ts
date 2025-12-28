import {Component, input} from '@angular/core';
import {DayInfo} from "@open-booking/core";

@Component({
  selector: 'app-day-info-details-chart',
  imports: [],
  templateUrl: './day-info-details-chart.component.html',
  styleUrl: './day-info-details-chart.component.scss',
})
export class DayInfoDetailsChartComponent {
  data = input.required<DayInfo>()
}
