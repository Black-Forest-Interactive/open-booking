import {Component, computed, resource} from '@angular/core';
import {CacheService} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {CacheInfo} from "@open-booking/core";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {EChartsCoreOption} from "echarts";
import {MatDividerModule} from "@angular/material/divider";
import {NgxEchartsDirective} from "ngx-echarts";

@Component({
  selector: 'app-cache',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    LoadingBarComponent,
    NgxEchartsDirective
  ],
  templateUrl: './cache.component.html',
  styleUrl: './cache.component.scss',
})
export class CacheComponent {
  displayedColumns: string[] = ['name', 'hit', 'load', 'evict', 'cmd']

  chart: EChartsCoreOption = {
    animation: true,
    animationDuration: 400,

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },

    legend: {
      top: 0,
      icon: 'roundRect'
    },

    grid: {
      left: 80,
      right: 24,
      top: 40,
      bottom: 24,
      containLabel: true
    },

    xAxis: {
      type: 'value',
      name: 'Count',
      nameLocation: 'middle',
      nameGap: 30,
      axisLine: {show: true},
      axisTick: {show: false},
      splitLine: {
        lineStyle: {type: 'dashed'}
      }
    },

    yAxis: {
      type: 'category',
      data: ['hit', 'load', 'evict'],
      axisTick: {show: false},
      axisLine: {show: true},
      axisLabel: {
        fontWeight: 500
      }
    },

    series: []
  }


  private cacheResource = resource({
    loader: (param) => {
      return toPromise(this.service.getAllCacheInfos(), param.abortSignal)
    }
  })

  entries = computed(() => this.cacheResource.value() ?? [])
  reloading = this.cacheResource.isLoading

  values = computed(() => this.updateChart(this.entries()))

  constructor(
    private service: CacheService,
  ) {
  }

  updateChart(entries: CacheInfo[]): EChartsCoreOption {
    return {
      yAxis: {
        data: entries.map(i => i.name).reverse()
      },
      series: [
        {
          name: 'Hit',
          type: 'bar',
          stack: 'hit',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: entries.map(i => i.hitCount)
        },
        {
          name: 'Miss',
          type: 'bar',
          stack: 'hit',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: entries.map(i => i.missCount)
        },
        {
          name: 'Evict Count',
          type: 'bar',
          stack: 'evict',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: entries.map(i => i.evictionCount)
        },
        {
          name: 'Evict Weight',
          type: 'bar',
          stack: 'evict',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: entries.map(i => i.evictionWeight)
        },
        {
          name: 'Load Success',
          type: 'bar',
          stack: 'load',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: entries.map(i => i.loadSuccessCount)
        },
        {
          name: 'Load Failure',
          type: 'bar',
          stack: 'load',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: entries.map(i => i.loadFailureCount)
        }
      ]
    };
  }


  reset(info: CacheInfo) {
    this.service.resetCache(info.key).subscribe(d => this.cacheResource.reload())
  }


}
