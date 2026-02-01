import {computed, Injectable, resource, signal} from "@angular/core";
import {BookingSearchRequest, BookingStatus} from "@open-booking/core";
import {toPromise} from "@open-booking/shared";
import {BookingService} from "@open-booking/admin";
import {PageEvent} from "@angular/material/paginator";
import {DateTime} from "luxon";

@Injectable({
  providedIn: 'root'
})
export class ReservationFilterService {

  private fullTextSearch = signal('')
  private dateFrom = signal<string | null | undefined>(null)
  private dateTo = signal<string | null | undefined>(null)
  pageNumber = signal(0)
  pageSize = signal(100)

  onlyMailConfirmed = signal(false)

  private bookingsCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: new BookingSearchRequest(this.fullTextSearch(), [BookingStatus.PENDING], this.dateFrom(), this.dateTo(), this.onlyMailConfirmed())
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
  hasActiveFilters = computed(() =>
    this.dateFrom() !== null ||
    this.dateTo() !== null
  )

  constructor(private service: BookingService) {
  }

  handleSearch(text: string) {
    this.fullTextSearch.set(text)
  }

  handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  handleDateSelectionChanged(start: DateTime | null | undefined, end: DateTime | null | undefined) {
    this.pageNumber.set(0)
    this.dateFrom.set(start?.toISODate())
    this.dateTo.set(end?.toISODate())
  }

  clearFilters() {
    this.dateFrom.set(null)
    this.dateTo.set(null)
  }

  reload() {
    this.bookingsResource.reload()
  }
}
