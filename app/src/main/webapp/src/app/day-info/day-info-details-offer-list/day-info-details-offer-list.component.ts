import {Component, Input} from '@angular/core';
import {DayInfo, defaultDayInfo} from "../model/day-info-api";

@Component({
  selector: 'app-day-info-details-offer-list',
  templateUrl: './day-info-details-offer-list.component.html',
  styleUrls: ['./day-info-details-offer-list.component.scss']
})
export class DayInfoDetailsOfferListComponent {

  @Input()  data: DayInfo  = defaultDayInfo


}
