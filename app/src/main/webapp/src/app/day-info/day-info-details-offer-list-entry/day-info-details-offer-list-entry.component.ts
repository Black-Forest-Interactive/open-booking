import {Component, Input} from '@angular/core';
import {DayInfoHelper, DayInfoOffer} from "../../offer/model/offer-api";
import {DayInfoService} from "../model/day-info.service";
import {DayInfo, defaultDayInfo} from "../model/day-info-api";

@Component({
  selector: 'app-day-info-details-offer-list-entry',
  templateUrl: './day-info-details-offer-list-entry.component.html',
  styleUrls: ['./day-info-details-offer-list-entry.component.scss']
})
export class DayInfoDetailsOfferListEntryComponent {


  // @ts-ignore
  @Input() entry: DayInfoOffer
  @Input() data: DayInfo = defaultDayInfo

  spaceAvailable: number = 0
  param: any

  constructor(private service: DayInfoService) {
  }

  ngOnInit() {
    this.param = {value: DayInfoHelper.getSpaceAvailable(this.entry)}
  }


  select() {
    this.service.selectionAddDayInfoOffer(this.data, this.entry)
  }
}
