import {Component, computed, resource, signal} from '@angular/core';

import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AuthService, toPromise} from "@open-booking/shared";
import {BookingService} from "@open-booking/admin";
import {BookingSearchRequest, DaySummary, WeekSummary} from "@open-booking/core";
import {DateTime} from "luxon";
import {MatIconModule} from "@angular/material/icon";
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {interval} from "rxjs";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {JsonPipe, LowerCasePipe} from "@angular/common";
import {BookingContentComponent} from "./booking-content/booking-content.component";

@Component({
  selector: 'app-booking',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    LowerCasePipe,
    TranslatePipe,
    ReactiveFormsModule,
    MainContentComponent,
    BookingContentComponent,
    JsonPipe
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {

  debug = signal(false)
  private fullTextSearch = signal('')
  dateFrom = signal<string | null | undefined>(null)
  dateTo = signal<string | null | undefined>(null)
  isSearchActive = computed(() => this.fullTextSearch().length > 0)

  range = new FormGroup({
    start: new FormControl<DateTime | null>(null, Validators.required),
    end: new FormControl<DateTime | null>(null, Validators.required),
  })

  pageNumber = signal(0)
  pageSize = signal(25)

  request = computed(() =>
    (this.isSearchActive()) ?
      new BookingSearchRequest(this.fullTextSearch(), [], '', '')
      :
      new BookingSearchRequest(this.fullTextSearch(), [], this.dateFrom(), this.dateTo())
  )

  private bookingsCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: this.request()
  }))


  private bookingsResource = resource({
    params: this.bookingsCriteria,
    loader: param => toPromise(this.service.searchBooking(param.params.request, param.params.page, param.params.size), param.abortSignal)
  })

  private response = computed(() => this.bookingsResource.value())
  private page = computed(() => this.response()?.result)
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.bookingsResource.isLoading


  constructor(
    private service: BookingService,
    protected readonly authService: AuthService
  ) {
    this.range.valueChanges.subscribe(d => this.handleSelectionChange())

    interval(5000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.bookingsResource.reload())
  }


  protected handleSearch(text: string) {
    this.fullTextSearch.set(text)
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  protected handleSelectionChange() {
    let start = this.range.get('start')?.value
    let end = this.range.get('end')?.value
    if (this.range.invalid) return
    if (start != null && end != null) {
      this.pageNumber.set(0)
      this.applyFilter()
    }
  }

  protected applyFilter() {
    let filter = this.range.value
    this.dateFrom.set(filter.start?.toISODate())
    this.dateTo.set(filter.end?.toISODate())
  }

  protected clearFilters() {
    this.dateFrom.set(null)
    this.dateTo.set(null)
  }

  protected reload() {
    this.bookingsResource.reload()
  }

  protected handleSelectionWeekChanged(event: WeekSummary) {
    this.dateFrom.set(event.startDate)
    this.dateTo.set(event.endDate)
  }

  protected handleSelectionDayChanged(event: DaySummary | undefined) {
    if (event) {
      this.dateFrom.set(event.date)
      this.dateTo.set(event.date)
    }
  }
}
