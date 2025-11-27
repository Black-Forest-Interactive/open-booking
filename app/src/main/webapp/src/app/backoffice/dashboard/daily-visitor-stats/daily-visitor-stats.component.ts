import {Component} from '@angular/core';
import {DashboardService} from "../model/dashboard.service";
import {DailyVisitorStats} from "../model/dashboard-api";
import {EChartsOption} from "echarts";
import {DayInfoService} from "../../../day-info/model/day-info.service";
import {TranslateService} from "@ngx-translate/core";
import * as moment from "moment";

@Component({
  selector: 'app-daily-visitor-stats',
  templateUrl: './daily-visitor-stats.component.html',
  styleUrls: ['./daily-visitor-stats.component.scss']
})
export class DailyVisitorStatsComponent {
  reloading: boolean = false
  data: DailyVisitorStats[] = []

  dailyChartOption: EChartsOption = {}
  totalChartOption: EChartsOption = {}

  constructor(private service: DashboardService, private dayInfoService: DayInfoService, private translationService: TranslateService) {
  }

  ngOnInit() {
    this.reload()
  }

  private reload() {
    if (this.reloading) return
    this.reloading = true
    this.service.getDailyVisitorStats().subscribe(d => this.handleData(d))
  }

  private handleData(d: DailyVisitorStats[]) {
    this.data = d

    let totalConfirmed = d.map(v => v.space.CONFIRMED as number).reduce((sum, current) => sum + current, 0)
    let totalUnconfirmed = d.map(v => v.space.UNCONFIRMED as number).reduce((sum, current) => sum + current, 0)
    let totalSpace = d.map(v => v.totalSpace).reduce((sum, current) => sum + current, 0)
    let totalRemaining = totalSpace - totalConfirmed - totalUnconfirmed

    this.totalChartOption = {
      title: {
        text: this.translationService.instant('DASHBOARD.Stats.TotalVisitor.Title'),
      },
      toolbox: {
        feature: {
          dataView: {show: true, readOnly: false},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      animation: false,
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: 10,
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {value: totalConfirmed, name: this.dayInfoService.labelConfirmed},
            {value: totalUnconfirmed, name: this.dayInfoService.labelUnconfirmed},
            {value: totalRemaining, name: this.translationService.instant('DASHBOARD.Stats.TotalVisitor.TotalRemaining')},
          ]
        }
      ]
    }


    this.dailyChartOption = {
      title: {
        text: this.translationService.instant('DASHBOARD.Stats.DailyVisitor.Title'),
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      toolbox: {
        feature: {
          dataView: {show: true, readOnly: false},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      animation: false,
      legend: {
        bottom: 10,
        left: 'center',
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: d.map(i => moment(i.date).format('DD.MM.YY'))
      },
      yAxis: [
        {
          type: 'value',
          name: this.translationService.instant('DASHBOARD.Stats.DailyVisitor.yAxis'),
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: this.translationService.instant('DASHBOARD.Stats.DailyVisitor.TotalSpace'),
          type: 'line',
          data: d.map(i => i.totalSpace),

        },
        {
          name: this.dayInfoService.labelConfirmed,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: d.map(i => i.space.CONFIRMED),
          color: "#91cc75"
        },
        {
          name: this.dayInfoService.labelUnconfirmed,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: d.map(i => i.space.UNCONFIRMED),
          color: "#fac858"
        },
        {
          name: this.dayInfoService.labelDeactivated,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: d.map(i => i.space.DEACTIVATED),
          color: "#ee6666"
        }
      ]
    }
    this.reloading = false
  }
}
