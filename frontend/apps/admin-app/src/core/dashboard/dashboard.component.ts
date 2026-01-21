import {Component, computed, effect, resource, signal} from '@angular/core';
import {DashboardSummaryComponent} from "./dashboard-summary/dashboard-summary.component";
import {DashboardContentComponent} from "./dashboard-content/dashboard-content.component";
import {DailyOffersFilterRequest, DashboardService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {toPromise} from "@open-booking/shared";
import {DaySummary, OfferSearchRequest, WeekSummary} from "@open-booking/core";
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

  private summaryResource = resource({
    loader: (param) => toPromise(this.service.getSummary(), param.abortSignal)
  })

  summary = computed(() => this.summaryResource.value() ?? [])
  summaryReloading = computed(() => this.summaryResource.isLoading())

  selectedWeek = signal<WeekSummary | undefined>(undefined)
  selectedDay = signal<DaySummary | undefined>(undefined)

  filter = signal(new OfferSearchRequest('', '', ''))

  private contentCriteria = computed(() => ({
    filter: this.createSearchRequest(this.selectedDay())
  }))

  private contentResource = resource({
    params: this.contentCriteria,
    loader: (param) => toPromise(this.service.getOfferEntries(param.params.filter), param.abortSignal)
  })

  contentReloading = computed(() => this.contentResource.isLoading())
  content = computed(() => this.contentResource.value() ?? [])

  constructor(private service: DashboardService, private toast: HotToastService) {
    effect(() => {
      let week = this.summary()[0]
      this.handleWeekSelection(week)
    })
  }

  protected handleDaySelection(day: DaySummary) {
    this.selectedDay.set(day)
  }

  protected handleWeekSelection(week: WeekSummary) {
    this.selectedWeek.set(week)

    let day = week?.days[0]
    this.handleDaySelection(day)
  }

  protected handleFilterChanged(request: DailyOffersFilterRequest) {
    // this.filter.set(request)
  }

  protected clearFilter() {

  }


  private createSearchRequest(day: DaySummary | undefined): OfferSearchRequest {
    let date = (day) ? DateTime.fromISO(day.date, {zone: 'utc'}) : DateTime.utc()
    let from = date.startOf('day').toISO()
    let to = date.endOf('day').toISO()

    return new OfferSearchRequest('', from, to)
  }
}
