import {Component, computed, resource, signal} from '@angular/core';
import {DashboardSummaryComponent} from "./dashboard-summary/dashboard-summary.component";
import {DashboardContentComponent} from "./dashboard-content/dashboard-content.component";
import {DashboardService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {toPromise} from "@open-booking/shared";
import {DaySummary, OfferSearchRequest} from "@open-booking/core";
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {TranslatePipe} from "@ngx-translate/core";
import {DateTime} from "luxon";

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardSummaryComponent,
    DashboardContentComponent,
    MainContentComponent,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

  filter = signal(new OfferSearchRequest('', '', ''))

  private contentResource = resource({
    params: this.filter,
    loader: (param) => toPromise(this.service.getOfferEntries(param.params), param.abortSignal)
  })

  contentReloading = computed(() => this.contentResource.isLoading())
  content = computed(() => this.contentResource.value() ?? [])

  constructor(private service: DashboardService, private toast: HotToastService) {

  }

  protected handleDaySelection(day: DaySummary | undefined) {
    this.filter.set(this.createSearchRequest(day))
  }

  private createSearchRequest(day: DaySummary | undefined): OfferSearchRequest {
    let date = (day) ? DateTime.fromISO(day.date, {zone: 'utc'}) : DateTime.utc()
    let from = date.startOf('day').toISO()
    let to = date.endOf('day').toISO()

    return new OfferSearchRequest('', from, to)
  }

}
