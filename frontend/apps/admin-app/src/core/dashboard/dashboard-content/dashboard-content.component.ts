import {Component, computed, input, output, resource} from '@angular/core';
import {DashboardService, DaySummary} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {DashboardContentEntryComponent} from "../dashboard-content-entry/dashboard-content-entry.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-dashboard-content',
  imports: [
    LoadingBarComponent,
    DashboardContentEntryComponent,
    MatIcon
  ],
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
})
export class DashboardContentComponent {

  selectedDay = input<DaySummary>()

  private dailyOffersResource = resource({
    params: this.selectedDay,
    loader: (param) => toPromise(this.service.getDailyOffers(param.params.date), param.abortSignal)
  })

  offers = computed(() => this.dailyOffersResource.value()?.offers ?? [])
  reloading = computed(() => this.dailyOffersResource.isLoading())

  clearFilter = output<boolean>()

  constructor(private service: DashboardService) {

  }

}
