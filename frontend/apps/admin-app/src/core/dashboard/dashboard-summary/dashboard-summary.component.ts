import {Component, computed, effect, output, resource, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {DatePipe, NgClass} from "@angular/common";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {DashboardService, DaySummary, WeekSummary} from "@open-booking/admin";

@Component({
  selector: 'app-dashboard-summary',
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    DatePipe,
    LoadingBarComponent,
    NgClass
  ],
  templateUrl: './dashboard-summary.component.html',
  styleUrl: './dashboard-summary.component.scss',
})
export class DashboardSummaryComponent {

  private weekSummaryResource = resource({
    loader: (param) => toPromise(this.service.getSummary(), param.abortSignal)
  })

  weekSummary = computed(() => this.weekSummaryResource.value() ?? [])
  reloading = computed(() => this.weekSummaryResource.isLoading())


  selectedWeek = signal<WeekSummary | undefined>(undefined)
  daySummary = computed(() => this.selectedWeek()?.days ?? [])
  selectedDay = signal<DaySummary | undefined>(undefined)


  selectionWeekChanged = output<WeekSummary>()
  selectionDayChanged = output<DaySummary>()

  constructor(private service: DashboardService) {
    effect(() => {
      let week = this.weekSummary()[0]
      this.handleWeekSelection(week)
    })
  }

  protected handleDaySelection(day: DaySummary) {
    this.selectedDay.set(day)
    this.selectionDayChanged.emit(day)
  }

  protected handleWeekSelection(week: WeekSummary) {
    this.selectedWeek.set(week)
    this.selectionWeekChanged.emit(week)

    let day = week?.days[0]
    this.handleDaySelection(day)
  }
}
