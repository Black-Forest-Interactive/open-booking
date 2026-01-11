import {Component, computed, effect, resource, signal} from '@angular/core';
import {DashboardSummaryComponent} from "./dashboard-summary/dashboard-summary.component";
import {DashboardFilterComponent} from "./dashboard-filter/dashboard-filter.component";
import {DashboardContentComponent} from "./dashboard-content/dashboard-content.component";
import {DailyOffersFilterRequest, DashboardService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {toPromise} from "@open-booking/shared";
import {DaySummary, WeekSummary} from "@open-booking/core";

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardSummaryComponent,
    DashboardFilterComponent,
    DashboardContentComponent
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

  filter = signal<DailyOffersFilterRequest>(new DailyOffersFilterRequest('', '', ''))

  private contentCriteria = computed(() => ({
    date: this.selectedDay()?.date ?? '',
    filter: this.filter()
  }))

  private contentResource = resource({
    params: this.contentCriteria,
    loader: (param) => toPromise(this.service.getOfferEntries(param.params.date, param.params.filter), param.abortSignal)
  })

  contentReloading = computed(() => this.contentResource.isLoading())
  content = computed(() => this.contentResource.value() ?? [])


  // DUMMY DATA
  availableGuides = signal<string[]>([
    'Sarah Johnson',
    'Mike Chen',
    'Emily Rodriguez',
    'David Kim',
    'Lisa Anderson',
    'Tom Williams',
    'Jessica Lee'
  ])


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
    this.filter.set(request)
  }

  protected clearFilter() {

  }


}
