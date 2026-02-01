import {Component, computed, effect, inject, resource} from '@angular/core';
import {toPromise} from "@open-booking/shared";
import {Statistics} from "@open-booking/core";
import {EChartsOption} from "echarts";
import {MatCardModule} from "@angular/material/card";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {NgxEchartsModule} from "ngx-echarts";
import {DecimalPipe} from "@angular/common";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {StatisticsService} from "@open-booking/admin";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-statistics',
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    NgxEchartsModule,
    TranslatePipe,
    DecimalPipe,
    MainContentComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {

  private translate = inject(TranslateService)

  labelTotalActiveOfferSpace = toSignal(this.translate.get('STATISTICS.TotalActiveOfferSpace'))
  labelTotalDeactivatedOfferSpace = toSignal(this.translate.get('STATISTICS.TotalDeactivatedOfferSpace'))
  labelTotalConfirmedSpace = toSignal(this.translate.get('STATISTICS.TotalConfirmedSpace'))
  labelTotalPendingSpace = toSignal(this.translate.get('STATISTICS.TotalPendingSpace'))

  private statisticsResource = resource({
    loader: param => toPromise(this.service.getStatistics(), param.abortSignal)
  })

  data = computed(() => this.statisticsResource.value())
  reloading = this.statisticsResource.isLoading

  totalChartOptions: EChartsOption = {}
  bookingStatusChartOptions: EChartsOption = {}
  verificationStatusChartOptions: EChartsOption = {}
  visitorTypeChartOptions: EChartsOption = {}
  offersByDayChartOptions: EChartsOption = {}
  spaceByDayChartOptions: EChartsOption = {}


  totalActiveOfferSpace = computed(() => this.data()?.totalActiveOfferSpace ?? 0)
  totalDeactivatedOfferSpace = computed(() => this.data()?.totalDeactivatedOfferSpace ?? 0)
  totalConfirmedSpace = computed(() => this.data()?.totalConfirmedSpace ?? 0)
  totalPendingSpace = computed(() => this.data()?.totalPendingSpace ?? 0)
  avgConfirmedSpace = computed(() => this.data()?.avgConfirmedSpace ?? 0)
  avgPendingSpace = computed(() => this.data()?.avgPendingSpace ?? 0)
  avgAvailableSpace = computed(() => this.data()?.avgAvailableSpace ?? 0)

  constructor(private service: StatisticsService) {
    effect(() => {
      let data = this.data()
      if (data) this.initializeCharts(data)
    });
  }

  private initializeCharts(data: Statistics) {
    this.initTotalChart(data)
    this.initBookingStatusChart(data)
    this.initVerificationStatusChart(data)
    this.initVisitorTypeChart(data)
    this.initOffersByDayChart(data)
    this.initSpaceByDayChart(data)
  }

  private initTotalChart(data: Statistics) {
    const value = [
      {name: this.labelTotalActiveOfferSpace(), value: data.totalActiveOfferSpace},
      {name: this.labelTotalDeactivatedOfferSpace(), value: data.totalDeactivatedOfferSpace},
      {name: this.labelTotalConfirmedSpace(), value: data.totalConfirmedSpace},
      {name: this.labelTotalPendingSpace(), value: data.totalPendingSpace}
    ]

    this.totalChartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      label: {
        show: false,
        position: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: value,
        }
      ]
    };
  }

  private initBookingStatusChart(data: Statistics) {
    const value = Object.entries(data.bookingStatusDistribution).map(([status, stats]) => ({
      name: status,
      value: stats.totalSeats
    }));

    this.bookingStatusChartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} seats ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        left: 'left'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  private initVerificationStatusChart(data: Statistics) {
    const value = Object.entries(data.verificationStatusDistribution).map(([status, count]) => ({
      name: status,
      value: count
    }));

    this.verificationStatusChartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  private initVisitorTypeChart(data: Statistics) {
    const categories = Object.keys(data.visitorTypeDistribution)
    const values = Object.values(data.visitorTypeDistribution)

    this.visitorTypeChartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: categories
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: '#5470c6'
          }
        }
      ]
    };
  }

  private initOffersByDayChart(data: Statistics) {
    const dates = data.offersByDay.map(d => d.date);
    const counts = data.offersByDay.map(d => d.count);

    this.offersByDayChartOptions = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'line',
          data: counts,
          smooth: true,
          areaStyle: {
            opacity: 0.3
          }
        }
      ]
    };
  }

  private initSpaceByDayChart(data: Statistics) {
    const dates = data.spaceByDay.map(d => d.date)
    const totalSpace = data.spaceByDay.map(d => d.totalSpace)
    const confirmedSpace = data.spaceByDay.map(d => d.confirmedSpace)
    const pendingSpace = data.spaceByDay.map(d => d.pendingSpace)
    const availableSpace = data.spaceByDay.map(d => d.availableSpace)

    this.spaceByDayChartOptions = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Total', 'Confirmed', 'Pending', 'Available']
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      series: [
        {
          name: 'Total',
          type: 'bar',
          stack: 'total',
          data: totalSpace,
        },
        {
          name: 'Confirmed',
          type: 'bar',
          stack: 'total',
          data: confirmedSpace,
        },
        {
          name: 'Pending',
          type: 'bar',
          stack: 'total',
          data: pendingSpace,
        },
        {
          name: 'Available',
          type: 'bar',
          stack: 'total',
          data: availableSpace,
        }
      ]
    };
  }

  getUtilizationPercentage(data: Statistics, type: 'confirmed' | 'pending' | 'available'): number {
    const maxSpace = data.totalMaxSpace || 1;
    switch (type) {
      case 'confirmed':
        return (data.avgConfirmedSpace / maxSpace) * 100;
      case 'pending':
        return (data.avgPendingSpace / maxSpace) * 100;
      case 'available':
        return (data.avgAvailableSpace / maxSpace) * 100;
      default:
        return 0;
    }
  }

  protected reload() {
    this.statisticsResource.reload()
  }
}
