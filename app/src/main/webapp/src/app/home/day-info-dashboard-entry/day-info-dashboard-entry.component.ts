import {Component, Input} from '@angular/core';
import {DayInfo, defaultDayInfo} from "../../day-info/model/day-info-api";
import {DayInfoService} from "../../day-info/model/day-info.service";
import {EChartsOption} from "echarts";

@Component({
  selector: 'app-day-info-dashboard-entry',
  templateUrl: './day-info-dashboard-entry.component.html',
  styleUrls: ['./day-info-dashboard-entry.component.scss']
})
export class DayInfoDashboardEntryComponent {

  @Input()
  data: DayInfo = defaultDayInfo

  selected = false;

  constructor(private service: DayInfoService) {
  }

  isSelected(): boolean {
    return false
  }

  chartOption: EChartsOption = {};

  ngOnInit() {
    let chart = this.service.createDayInfoChart(this.data)
    chart.legend = undefined
    chart.title = undefined
    chart.yAxis = {type: 'value', show: false}
    this.chartOption = chart

  }
}
