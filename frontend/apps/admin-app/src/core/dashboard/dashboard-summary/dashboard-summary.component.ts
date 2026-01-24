import {Component, computed, effect, input, output, resource, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {DatePipe, NgClass} from "@angular/common";
import {BookingStatusComponent, LoadingBarComponent, toPromise} from "@open-booking/shared";
import {BookingStatus, DaySummary, WeekSummary} from "@open-booking/core";
import {DashboardService} from "@open-booking/admin";
import {OfferAssignmentComponent} from "../../offer/offer-assignment/offer-assignment.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-dashboard-summary',
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    DatePipe,
    LoadingBarComponent,
    NgClass,
    OfferAssignmentComponent,
    TranslatePipe,
    BookingStatusComponent
  ],
  templateUrl: './dashboard-summary.component.html',
  styleUrl: './dashboard-summary.component.scss',
})
export class DashboardSummaryComponent {

  // input
  showBookingStats = input(true)
  isSearchActive = input<boolean>(false)

  // Output
  selectionWeekChanged = output<WeekSummary>()
  selectionDayChanged = output<DaySummary | undefined>()

  private weekSummaryResource = resource({
    loader: param => toPromise(this.service.getWeeksSummary(), param.abortSignal)
  })

  weekSummary = computed(() => this.weekSummaryResource.value() ?? [])
  selectedWeek = signal<WeekSummary | undefined>(undefined)

  private daySummaryResource = resource({
    params: this.selectedWeek,
    loader: param => toPromise(this.service.getDaySummary(param.params.startDate, param.params.endDate), param.abortSignal)
  })

  daySummary = computed(() => this.daySummaryResource.value() ?? [])
  selectedDay = signal<DaySummary | undefined>(undefined)

  reloading = computed(() => this.weekSummaryResource.isLoading() || this.daySummaryResource.isLoading())


  constructor(private service: DashboardService) {
    effect(() => {
      let week = this.weekSummary()[0]
      this.handleWeekSelection(week)
    })

    effect(() => {
      let daysWithOffers = this.daySummary().filter(d => d.assignment.availableSpace > 0 || d.assignment.confirmedSpace > 0 || d.assignment.pendingSpace > 0)
      if (daysWithOffers.length) {
        let day = daysWithOffers[0]
        this.handleDaySelection(day)
      } else {
        let day = this.daySummary()[0]
        this.handleDaySelection(day)
      }

    })
  }

  protected handleWeekSelection(week: WeekSummary) {
    this.selectedWeek.set(week)
    this.selectionWeekChanged.emit(week)
    this.handleDaySelection(undefined)
  }

  protected handleDaySelection(day: DaySummary | undefined) {
    this.selectedDay.set(day)
    this.selectionDayChanged.emit(day)
  }

  protected hasBookingStats(bookingStats: Record<BookingStatus, number>): boolean {
    return Object.values(bookingStats).some(count => count > 0)
  }

  protected getBookingStatuses(bookingStats: Record<BookingStatus, number>): BookingStatus[] {
    return Object.keys(bookingStats) as BookingStatus[]
  }

}
