import {Component, computed, input, output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {DatePipe, NgClass} from "@angular/common";
import {LoadingBarComponent} from "@open-booking/shared";
import {DaySummary, WeekSummary} from "@open-booking/core";

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

  // Input
  reloading = input.required<boolean>()
  weekSummary = input.required<WeekSummary[]>()
  selectedWeek = input.required<WeekSummary | undefined>()
  daySummary = computed(() => this.selectedWeek()?.days ?? [])
  selectedDay = input.required<DaySummary | undefined>()

  // Output
  selectionWeekChanged = output<WeekSummary>()
  selectionDayChanged = output<DaySummary>()


  protected handleDaySelection(day: DaySummary) {
    this.selectionDayChanged.emit(day)
  }

  protected handleWeekSelection(week: WeekSummary) {
    this.selectionWeekChanged.emit(week)
  }
}
