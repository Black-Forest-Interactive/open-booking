import {Component, computed, resource, signal} from '@angular/core';
import {ReservationService} from "@open-booking/admin";
import {LoadingBarComponent, SearchComponent, toPromise} from "@open-booking/shared";
import {ReservationSearchRequest} from "@open-booking/core";
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
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

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
    LoadingBarComponent,
    SearchComponent,
    TranslatePipe,
    LowerCasePipe,
    ReservationContentComponent,
    FormsModule,
    DatePipe
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {

  private fullTextSearch = signal('')
  selectedStatus = signal<string[]>([])
  dateFrom = signal<Date | null>(null)
  dateTo = signal<Date | null>(null)

  pageNumber = signal(0)
  pageSize = signal(25)

  private reservationsCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: new ReservationSearchRequest(this.fullTextSearch())
  }))


  private reservationsResource = resource({
    params: this.reservationsCriteria,
    loader: param => toPromise(this.service.searchReservation(param.params.request, param.params.page, param.params.size), param.abortSignal)
  })

  private page = computed(() => this.reservationsResource.value()?.result)
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.reservationsResource.isLoading
  hasActiveFilters = computed(() =>
    this.selectedStatus().length > 0 ||
    this.dateFrom() !== null ||
    this.dateTo() !== null
  )

  constructor(private service: ReservationService) {
  }

  protected handleSearch(text: string) {
    this.fullTextSearch.set(text)
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  protected clearFilters() {
    this.selectedStatus.set([])
    this.dateFrom.set(null)
    this.dateTo.set(null)
  }

  removeStatusFilter(status: string) {
    const current = this.selectedStatus();
    this.selectedStatus.set(current.filter(s => s !== status))
  }

  clearDateFrom() {
    this.dateFrom.set(null)
  }

  clearDateTo() {
    this.dateTo.set(null)
  }
}
