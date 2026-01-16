import {Component, computed, resource, signal} from '@angular/core';
import {ReservationService} from "@open-booking/admin";
import {SearchComponent, toPromise} from "@open-booking/shared";
import {ReservationSearchRequest, ReservationStatus} from "@open-booking/core";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDividerModule} from "@angular/material/divider";
import {DatePipe, LowerCasePipe} from "@angular/common";
import {ReservationContentComponent} from "./reservation-content/reservation-content.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {DateTime} from "luxon";
import {interval} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
    SearchComponent,
    TranslatePipe,
    LowerCasePipe,
    ReservationContentComponent,
    FormsModule,
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {

  private fullTextSearch = signal('')
  availableStatusValues = Object.values(ReservationStatus)
  selectedStatus = signal<ReservationStatus[]>([ReservationStatus.UNCONFIRMED])
  dateFrom = signal<string | null | undefined>(null)
  dateTo = signal<string | null | undefined>(null)

  range = new FormGroup({
    start: new FormControl<DateTime | null>(null, Validators.required),
    end: new FormControl<DateTime | null>(null, Validators.required),
  })

  pageNumber = signal(0)
  pageSize = signal(25)

  private reservationsCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: new ReservationSearchRequest(this.fullTextSearch(), this.selectedStatus(), this.dateFrom(), this.dateTo())
  }))


  private reservationsResource = resource({
    params: this.reservationsCriteria,
    loader: param => toPromise(this.service.searchReservation(param.params.request, param.params.page, param.params.size), param.abortSignal)
  })

  private response = computed(() => this.reservationsResource.value())
  private status = computed(() => this.response()?.status)
  private page = computed(() => this.response()?.result)
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.reservationsResource.isLoading
  hasActiveFilters = computed(() =>
    this.selectedStatus().length > 0 ||
    this.dateFrom() !== null ||
    this.dateTo() !== null
  )

  constructor(private service: ReservationService) {
    this.range.valueChanges.subscribe(d => this.handleSelectionChange())

    interval(5000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.reservationsResource.reload())
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
    this.selectedStatus.set([ReservationStatus.UNCONFIRMED])
    this.dateFrom.set(null)
    this.dateTo.set(null)
  }

  protected removeStatusFilter(status: string) {
    const current = this.selectedStatus();
    this.selectedStatus.set(current.filter(s => s !== status))
  }

  protected clearDateFrom() {
    this.dateFrom.set(null)
  }

  protected clearDateTo() {
    this.dateTo.set(null)
  }

  protected reload() {
    this.reservationsResource.reload()
  }

  protected getStatusAmount(status: ReservationStatus): number {
    let result = this.status()
    if (!result) return 0

    let value = result[status] ?? 0
    return value
  }

  protected readonly ReservationStatus = ReservationStatus;
}
