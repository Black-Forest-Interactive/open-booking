import {Component, computed, resource, signal} from '@angular/core';
import {BookingService} from "@open-booking/admin";
import {AuthService, toPromise} from "@open-booking/shared";
import {BookingSearchRequest, BookingStatus} from "@open-booking/core";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDividerModule} from "@angular/material/divider";
import {LowerCasePipe} from "@angular/common";
import {ReservationContentComponent} from "./reservation-content/reservation-content.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {DateTime} from "luxon";
import {interval} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-reservation',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    TranslatePipe,
    LowerCasePipe,
    ReservationContentComponent,
    FormsModule,
    ReactiveFormsModule,
    MainContentComponent,
    MatProgressSpinner
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {

  private fullTextSearch = signal('')
  dateFrom = signal<string | null | undefined>(null)
  dateTo = signal<string | null | undefined>(null)

  range = new FormGroup({
    start: new FormControl<DateTime | null>(null, Validators.required),
    end: new FormControl<DateTime | null>(null, Validators.required),
  })

  pageNumber = signal(0)
  pageSize = signal(25)

  private bookingsCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: new BookingSearchRequest(this.fullTextSearch(), [BookingStatus.PENDING], this.dateFrom(), this.dateTo())
  }))


  private bookingsResource = resource({
    params: this.bookingsCriteria,
    loader: param => toPromise(this.service.searchBooking(param.params.request, param.params.page, param.params.size), param.abortSignal)
  })

  private response = computed(() => this.bookingsResource.value())
  private status = computed(() => this.response()?.status)
  private page = computed(() => this.response()?.result)
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.bookingsResource.isLoading
  hasActiveFilters = computed(() =>
    this.dateFrom() !== null ||
    this.dateTo() !== null
  )

  constructor(private service: BookingService, protected readonly authService: AuthService) {
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

  protected clearDateFrom() {
    this.dateFrom.set(null)
  }

  protected clearDateTo() {
    this.dateTo.set(null)
  }

  protected reload() {
    this.bookingsResource.reload()
  }

}
