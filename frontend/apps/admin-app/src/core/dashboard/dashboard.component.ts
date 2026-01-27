import {Component, computed, resource, signal} from '@angular/core';
import {DashboardSummaryComponent} from "./dashboard-summary/dashboard-summary.component";
import {DashboardService} from "@open-booking/admin";
import {toPromise} from "@open-booking/shared";
import {DaySummary, OfferSearchRequest} from "@open-booking/core";
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {TranslatePipe} from "@ngx-translate/core";
import {DateTime} from "luxon";
import {DashboardContentComponent} from "./dashboard-content/dashboard-content.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-dashboard',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DashboardSummaryComponent,
    MainContentComponent,
    TranslatePipe,
    DashboardContentComponent
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

  constructor(private service: DashboardService) {

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

  protected reload() {
    this.contentResource.reload()
  }
}
