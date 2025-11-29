import {Component, computed, resource, signal} from '@angular/core';
import {DashboardToolbarComponent} from "../dashboard-toolbar/dashboard-toolbar.component";
import {DashboardContentComponent} from "../dashboard-content/dashboard-content.component";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {DashboardService, DateRangeSelectionRequest} from "@open-booking/portal";

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardToolbarComponent,
    DashboardContentComponent,
    LoadingBarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

  from = signal('')
  to = signal('')

  request = computed(() => new DateRangeSelectionRequest(this.from(), this.to()))

  private entriesResource = resource({
    params: this.request,
    loader: (param) => {
      return toPromise(this.service.selectDayInfo(param.params), param.abortSignal)
    }
  })

  entries = computed(() => this.entriesResource.value() ?? [])
  reloading = this.entriesResource.isLoading

  constructor(private service: DashboardService) {
  }

}
