import {Component, Input} from '@angular/core';
import {DayInfo, defaultDayInfo} from "../../day-info/model/day-info-api";

@Component({
  selector: 'app-day-info-details-list',
  templateUrl: './day-info-details-list.component.html',
  styleUrls: ['./day-info-details-list.component.scss']
})
export class DayInfoDetailsListComponent {

  @Input()  data: DayInfo  = defaultDayInfo
}
