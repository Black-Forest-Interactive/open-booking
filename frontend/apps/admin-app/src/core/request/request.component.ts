import {Component, computed, resource, signal} from '@angular/core';
import {RequestService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {LoadingBarComponent, SearchComponent, toPromise} from "@open-booking/shared";
import {BookingRequestFilterRequest, BookingRequestInfo, VISITOR_GROUP_STATUS, VisitorGroup} from "@open-booking/core";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {MatSlideToggleChange, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTableModule} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatChipsModule} from "@angular/material/chips";
import {DatePipe} from "@angular/common";
import {GroupInfoDialogComponent} from "../group/group-info-dialog/group-info-dialog.component";
import {RequestCommentDialogComponent} from "./request-comment-dialog/request-comment-dialog.component";
import {RequestVisitorGroupEntryComponent} from "./request-visitor-group-entry/request-visitor-group-entry.component";
import {RequestBookingEntryComponent} from "./request-booking-entry/request-booking-entry.component";
import {GroupStatusComponent} from "../group/group-status/group-status.component";

@Component({
  selector: 'app-request',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    ReactiveFormsModule,
    TranslatePipe,
    DatePipe,
    RouterLink,
    LoadingBarComponent,
    SearchComponent,
    RequestVisitorGroupEntryComponent,
    RequestBookingEntryComponent,
    GroupStatusComponent
  ],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
})
export class RequestComponent {
  displayedColumns: string[] = ['timestamp', 'visitorGroup', 'bookings', 'note']
  form: FormGroup

  pageNumber = signal(0)
  pageSize = signal(25)
  showVisitorGroupDetails = signal(true)
  visitorGroupStatus = VISITOR_GROUP_STATUS
  request = signal<BookingRequestFilterRequest | undefined>(undefined)

  private requestCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: this.request()
  }))

  private requestResource = resource({
    params: this.requestCriteria,
    loader: (param) => {
      if (param.params.request) {
        return toPromise(this.service.filterAllBookingRequestInfoUnconfirmed(param.params.request, param.params.page, param.params.size), param.abortSignal)
      } else {
        return toPromise(this.service.getAllBookingRequestInfoUnconfirmed(param.params.page, param.params.size), param.abortSignal)
      }
    }
  })

  private page = computed(() => this.requestResource.value())
  elements = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.requestResource.isLoading

  constructor(
    private fb: FormBuilder,
    private service: RequestService,
    private toast: HotToastService,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      offerDate: [null],
      visitorGroupStatus: [null],
      query: [null],
    })
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  protected handleEntryChanged() {
    this.requestResource.reload()
  }

  protected search(data: string) {
    this.toast.error("Sorry searching '" + data + "' is not supported yet")
  }

  protected showDetails(visitorGroup: VisitorGroup) {
    this.dialog.open(GroupInfoDialogComponent, {data: visitorGroup});
  }

  protected showVisitorGroupDetailsChanged($event: MatSlideToggleChange) {
    this.showVisitorGroupDetails.set($event.checked)
  }

  protected showNote(request: BookingRequestInfo) {
    this.dialog.open(RequestCommentDialogComponent, {data: request});
  }


  protected applyFilter() {
    if (this.form.invalid) return

    let value = this.form.value
    if (!value.offerDate && !value.visitorGroupStatus && !value.query) return

    let request = new BookingRequestFilterRequest(
      value.offerDate,
      value.visitorGroupStatus,
      value.query
    )
    this.request.set(request)
  }

  protected clearFilter() {
    if (!this.request()) return
    this.request.set(undefined)
    this.form.reset()
  }
}
