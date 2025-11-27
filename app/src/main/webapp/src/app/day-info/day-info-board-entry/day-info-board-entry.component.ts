import {Component, Input, OnInit} from '@angular/core';
import {DayInfo, defaultDayInfo} from "../model/day-info-api";
import {DayInfoService} from '../model/day-info.service';
import {EChartsOption} from 'echarts';

@Component({
  selector: 'app-day-info-board-entry',
  templateUrl: './day-info-board-entry.component.html',
  styleUrls: ['./day-info-board-entry.component.scss']
})
export class DayInfoBoardEntryComponent implements OnInit {
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

  selectDay() {
    this.service.selectionAddDayInfo(this.data)
  }
}
