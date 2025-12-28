import {Component, computed, inject, resource} from '@angular/core';
import {DashboardService} from "@open-booking/portal";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {AppService} from "../../app/app.service";
import {DayInfoDetailsListComponent} from "../day-info-details-list/day-info-details-list.component";
import {DayInfoDetailsChartComponent} from "../day-info-details-chart/day-info-details-chart.component";
import {defaultDayInfo} from "@open-booking/core";

@Component({
  selector: 'app-day-info-details',
  imports: [
    LoadingBarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    RouterLink,
    DayInfoDetailsListComponent,
    DayInfoDetailsChartComponent,
  ],
  templateUrl: './day-info-details.component.html',
  styleUrl: './day-info-details.component.scss',
})
export class DayInfoDetailsComponent {
  private route = inject(ActivatedRoute)
  private date = toSignal(this.route.paramMap.pipe(map(params => params.get('date'))))

  private dayInfoResource = resource({
    params: this.date,
    loader: (param) => {
      return toPromise(this.service.loadDayInfo(param.params ?? ''), param.abortSignal)
    }
  })

  data = computed(() => this.dayInfoResource.value() ?? defaultDayInfo)
  reloading = this.dayInfoResource.isLoading

  constructor(private service: DashboardService, protected app: AppService) {

  }

}
