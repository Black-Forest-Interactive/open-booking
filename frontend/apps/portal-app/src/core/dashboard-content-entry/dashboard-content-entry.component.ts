import {Component, computed, input} from '@angular/core';
import {DashboardEntry, DayInfoOffer} from "@open-booking/portal";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {CommonModule, DatePipe} from "@angular/common";
import {NgxEchartsDirective} from "ngx-echarts";
import {EChartsOption} from "echarts";

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

  labelDeactivated = ""
  labelConfirmed = ""
  labelUnconfirmed = ""
  labelAvailable = ""

  data = input.required<DashboardEntry>()

  chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    animation: false,
    legend: {
      data: [
        this.labelDeactivated,
        this.labelConfirmed,
        this.labelUnconfirmed,
        this.labelAvailable
      ],
      bottom: 10,
      left: 'center',
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: this.labelConfirmed,
      type: 'bar',
      stack: 'total',
      emphasis: {focus: 'series'},
      color: "#ee6666",
    }, {
      name: this.labelUnconfirmed,
      type: 'bar',
      stack: 'total',
      emphasis: {focus: 'series'},
      color: "#fac858",
    }, {
      name: this.labelDeactivated,
      type: 'bar',
      stack: 'total',
      emphasis: {focus: 'series'},
      color: "lightgrey",
    }, {
      name: this.labelAvailable,
      type: 'bar',
      stack: 'total',
      emphasis: {focus: 'series'},
      color: "#91cc75",
    }]
  }
  chartMerge = computed(() => this.createChartMerge(this.data()))

  constructor(private translate: TranslateService) {
    this.translate.get('DAY_INFO.Chart.Space.Series.Deactivated').subscribe(v => this.labelDeactivated = v)
    this.translate.get('DAY_INFO.Chart.Space.Series.Confirmed').subscribe(v => this.labelConfirmed = v)
    this.translate.get('DAY_INFO.Chart.Space.Series.Unconfirmed').subscribe(v => this.labelUnconfirmed = v)
    this.translate.get('DAY_INFO.Chart.Space.Series.Available').subscribe(v => this.labelAvailable = v)
  }


  private createChartMerge(info: DashboardEntry): EChartsOption {
    return {
      xAxis: {
        data: info.offer.map(i => i.offer.start.substring(11, 16))
      },
      series: [
        {
          data: info.offer.map(i => this.getSpaceConfirmed(i))
        }, {
          data: info.offer.map(i => this.getSpaceUnconfirmed(i))
        }, {
          data: info.offer.map(i => (!i.offer.active) ? i.offer.maxPersons : 0)
        },
        {
          data: info.offer.map(i => this.getSpaceAvailable(i))
        }
      ]
    }
  }

  private getSpaceAvailable(info: DayInfoOffer): number {
    let result = (info.offer.active) ? info.offer.maxPersons - info.space.CONFIRMED - info.space.UNCONFIRMED : 0
    if (result < 0) return 0
    if (result > info.offer.maxPersons) return info.offer.maxPersons
    return result
  }

  private getSpaceConfirmed(info: DayInfoOffer): number {
    let result = (info.offer.active) ? info.space.CONFIRMED : 0
    if (result < 0) return 0
    if (result > info.offer.maxPersons) return info.offer.maxPersons
    return result
  }

  private getSpaceUnconfirmed(info: DayInfoOffer): number {
    let result = (info.offer.active) ? info.space.UNCONFIRMED : 0
    if (result < 0) return 0
    if (result > info.offer.maxPersons) return info.offer.maxPersons
    return result
  }

}
