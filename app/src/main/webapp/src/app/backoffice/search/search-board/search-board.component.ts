import {Component, EventEmitter} from '@angular/core';
import {BookingService} from "../../booking/model/booking.service";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Page} from "../../../shared/page/page";
import {BookingSearchRequest, BookingSearchResult} from "../../booking/model/booking-api";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-search-board',
  templateUrl: './search-board.component.html',
  styleUrls: ['./search-board.component.scss']
})
export class SearchBoardComponent {

  reloading: boolean = false

  keyUp: EventEmitter<string> = new EventEmitter<string>()

  pageNumber = 0
  pageSize = 25
  totalElements = 0

  data: BookingSearchResult[] = []

  displayedColumns: string[] = ['title', 'contact', 'size', 'start', 'status', 'cmd']

  query: string = ''

  constructor(private service: BookingService) {
  }

  ngOnInit(): void {
    this.keyUp.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(data => this.search(data))
    this.loadPage()
  }

  search(query: string) {
    this.query = query
    this.loadPage()
  }

  private handleData(p: Page<BookingSearchResult>) {
    this.data = p.content
    this.totalElements = p.totalSize
    this.reloading = false
  }

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize
    this.pageNumber = event.pageIndex
    this.loadPage()
  }

  private loadPage() {
    if (this.reloading) return
    this.reloading = true
    this.service.searchBookingDetails(new BookingSearchRequest(this.query), this.pageNumber, this.pageSize)
      .subscribe({
        next: p => this.handleData(p),
        error: (e) => this.reloading = false
      })
  }
}
