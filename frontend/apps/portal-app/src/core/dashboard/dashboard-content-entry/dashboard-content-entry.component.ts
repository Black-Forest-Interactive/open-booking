import {Component, computed, inject, input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {CommonModule, DatePipe} from "@angular/common";
import {NgxEchartsDirective} from "ngx-echarts";
import {EChartsOption} from "echarts";
import {toSignal} from "@angular/core/rxjs-interop";
import {DayInfo} from "@open-booking/core";

@Component({
  selector: 'app-dashboard-content-entry',
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    RouterLink,
    DatePipe,
    NgxEchartsDirective,
  ],
  templateUrl: './dashboard-content-entry.component.html',
  styleUrl: './dashboard-content-entry.component.scss',
})
export class DashboardContentEntryComponent {

  private translate = inject(TranslateService)

  labelDeactivated = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Deactivated'))
  labelConfirmed = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Confirmed'))
  labelUnconfirmed = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Unconfirmed'))
  labelAvailable = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Available'))
  labelClaimed = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Claimed'))

  data = input.required<DayInfo>()
  chartMerge = computed(() => this.createChartMerge(this.data()))

  chartOption = computed<EChartsOption>(() => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {type: 'shadow'}
    },
    animation: false,
    grid: {
      containLabel: true,
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '3%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: true
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: this.labelConfirmed(),
        type: 'bar',
        stack: 'total',
        emphasis: {focus: 'series'},
        color: "#ee6666",
      },
      {
        name: this.labelUnconfirmed(),
        type: 'bar',
        stack: 'total',
        emphasis: {focus: 'series'},
        color: "#fac858",
      },
      {
        name: this.labelDeactivated(),
        type: 'bar',
        stack: 'total',
        emphasis: {focus: 'series'},
        color: "lightgrey",
      },
      {
        name: this.labelAvailable(),
        type: 'bar',
        stack: 'total',
        emphasis: {focus: 'series'},
        color: "#91cc75",
      },
      {
        name: this.labelClaimed(),
        type: 'bar',
        stack: 'total',
        emphasis: {focus: 'series'},
        color: "#73c0de",
      }
    ]
  }));


  private createChartMerge(info: DayInfo): EChartsOption {
    return {
      xAxis: {
        data: info.offer.map(i => i.offer.start.substring(11, 16))
      },
      series: [
        {data: info.offer.map(i => i.assignment.bookedSpace)},
        {data: info.offer.map(i => i.assignment.reservedSpace)},
        {data: info.offer.map(i => i.assignment.deactivatedSpace)},
        {data: info.offer.map(i => i.claimedUntil ? 0 : i.assignment.availableSpace)},
        {data: info.offer.map(i => i.claimedUntil ? i.assignment.availableSpace : 0)}
      ]
    }
  }


}
