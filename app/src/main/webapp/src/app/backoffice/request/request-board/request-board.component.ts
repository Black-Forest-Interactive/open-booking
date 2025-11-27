import {Component, EventEmitter} from '@angular/core';
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {BookingRequestService} from "../model/booking-request.service";
import {BookingRequestFilterRequest, BookingRequestInfo} from "../model/booking-request-api";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Page} from "../../../shared/page/page";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {VisitorGroup} from "../../../visitor-group/model/visitor-group-api";
import {PageEvent} from "@angular/material/paginator";
import {VisitorGroupInfoDialogComponent} from "../../visitor-group/visitor-group-info-dialog/visitor-group-info-dialog.component";
import {RequestCommentDialogComponent} from "../request-comment-dialog/request-comment-dialog.component";
import {VISITOR_GROUP_STATUS} from "../../visitor-group/model/visitor-group-api";
import {FormBuilder} from "@angular/forms";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
  selector: 'app-request-board',
  templateUrl: './request-board.component.html',
  styleUrls: ['./request-board.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})
export class RequestBoardComponent {
  reloading: boolean = false
  pageNumber = 0
  pageSize = 25
  totalElements = 0

  data: BookingRequestInfo[] = []

  displayedColumns: string[] = ['timestamp', 'visitorGroup', 'bookings', 'note']

  keyUp: EventEmitter<string> = new EventEmitter<string>()

  showVisitorGroupDetails: boolean = true

  visitorGroupStatus = VISITOR_GROUP_STATUS

  filterForm = this.fb.group(
    {
      offerDate: [null],
      visitorGroupStatus: [null],
      query: [null],
    }
  )
  filter: BookingRequestFilterRequest | unknown

  constructor(
    private service: BookingRequestService,
    private toastService: HotToastService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.loadPage(this.pageNumber)

    this.keyUp.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(data => this.search(data))
  }

  private loadPage(number: number) {
    if (this.reloading) return
    this.reloading = true

    let filter = this.filter
    if (filter) {
      this.service.filterAllBookingRequestInfoUnconfirmed(filter as BookingRequestFilterRequest, number, this.pageSize).subscribe(p => this.handleData(p))
    } else {
      this.service.getAllBookingRequestInfoUnconfirmed(number, this.pageSize).subscribe(p => this.handleData(p))
    }
  }

  private handleData(page: Page<BookingRequestInfo>) {
    if (page == null) {
      this.data = [];
      this.pageNumber = 0;
      this.totalElements = 0;
    } else {
      this.data = page.content.filter(d => d != null);
      this.pageNumber = page.pageable.number;
      this.totalElements = page.totalSize;
    }
    this.reloading = false;
  }

  handleEntryChanged() {
    this.loadPage(this.pageNumber)
  }

  handlePageChange(event: PageEvent) {
    if (this.reloading) return
    this.pageSize = event.pageSize
    this.loadPage(event.pageIndex)
  }

  showDetails(visitorGroup: VisitorGroup) {
    this.dialog.open(VisitorGroupInfoDialogComponent, {data: visitorGroup});
  }

  showVisitorGroupDetailsChanged($event: MatSlideToggleChange) {
    this.showVisitorGroupDetails = $event.checked
  }

  showNote(request: BookingRequestInfo) {
    this.dialog.open(RequestCommentDialogComponent, {data: request});
  }

  private search(data: string) {
    this.toastService.error("Sorry searching '" + data + "' is not supported yet")
  }


  applyFilter() {
    if (this.filterForm.invalid) return

    let value = this.filterForm.value
    if (!value.offerDate && !value.visitorGroupStatus && !value.query) return

    this.filter = new BookingRequestFilterRequest(
      value.offerDate,
      value.visitorGroupStatus,
      value.query
    )
    this.loadPage(0)
  }

  clearFilter() {
    if (!this.filter) return
    this.filter = undefined
    this.filterForm.reset()

    this.loadPage(0)
  }
}
