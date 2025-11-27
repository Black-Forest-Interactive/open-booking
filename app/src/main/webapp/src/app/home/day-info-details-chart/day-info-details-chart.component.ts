import {Component, Input} from '@angular/core';
import {DayInfo, defaultDayInfo} from "../../day-info/model/day-info-api";
import {Router} from "@angular/router";
import {DayInfoService} from "../../day-info/model/day-info.service";
import {EChartsOption} from "echarts";
import {DayInfoHelper} from "../../offer/model/offer-api";
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-day-info-details-chart',
  templateUrl: './day-info-details-chart.component.html',
  styleUrls: ['./day-info-details-chart.component.scss']
})
export class DayInfoDetailsChartComponent {

  @Input() set data(value: DayInfo) {
    this.spaceChartOption = this.service.createDayInfoChart(value)
    this._data = value
  }

  get data(): DayInfo {
    return this._data
  }

  private _data: DayInfo = defaultDayInfo


  spaceChartOption: EChartsOption = {};

  constructor(
    private service: DayInfoService,
    private router: Router,
    private translateService: TranslateService,
    private toastService: HotToastService
  ) {
  }


  onChartClick($event: any) {
    let index = $event.dataIndex as number | undefined
    if (index == undefined) return

    if (!this.data) return
    let info = this.data.offer[index]
    if (!info) return

    if (!info.offer.active) {
      this.translateService.get('ERROR.OfferIsDeactivated')
        .subscribe(msg => this.toastService.error(msg))
      return
    }

    let spaceAvailable = DayInfoHelper.getSpaceAvailable(info)
    if (spaceAvailable <= 0) {
      this.translateService.get('ERROR.NoSpaceLeftForBooking')
        .subscribe(msg => this.toastService.error(msg))
      return
    }
    this.router.navigate(['home', 'booking', info.offer.id]).then()
  }


}
