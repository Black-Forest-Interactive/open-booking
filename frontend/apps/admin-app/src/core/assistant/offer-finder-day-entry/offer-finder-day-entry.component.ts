import {Component, computed, inject, input, output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {OfferFinderDayEntry} from "../offer-finder/offer-finder.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {TranslateService} from "@ngx-translate/core";
import {EChartsOption} from "echarts";
import {NgxEchartsDirective} from "ngx-echarts";

@Component({
  selector: 'app-offer-finder-day-entry',
  imports: [MatIconModule, DatePipe, NgxEchartsDirective],
  templateUrl: './offer-finder-day-entry.component.html',
  styleUrl: './offer-finder-day-entry.component.scss',
})
export class OfferFinderDayEntryComponent {

  data = input.required<OfferFinderDayEntry>()

  selectDay = output<string>()

  protected onSelectDay() {
    this.selectDay.emit(this.data().day)
  }


  private translate = inject(TranslateService)

  labelDeactivated = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Deactivated'))
  labelConfirmed = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Confirmed'))
  labelUnconfirmed = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Unconfirmed'))
  labelAvailable = toSignal(this.translate.get('DAY_INFO.Chart.Space.Series.Available'))


  chartMerge = computed(() => this.createChartMerge(this.data()))

  chartOption = computed<EChartsOption>(() => ({
    tooltip: {show: false},
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
      boundaryGap: true,
      textNameStyle: {
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      show: false
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
      }
    ]
  }));


  private createChartMerge(info: OfferFinderDayEntry): EChartsOption {
    return {
      xAxis: {
        data: info.entries.map(i => i.offer.start.substring(11, 16))
      },
      series: [
        {data: info.entries.map(i => i.assignment.confirmedSpace)},
        {data: info.entries.map(i => i.assignment.pendingSpace)},
        {data: info.entries.map(i => i.assignment.deactivatedSpace)},
        {data: info.entries.map(i => i.assignment.availableSpace)}
      ]
    }
  }


}
