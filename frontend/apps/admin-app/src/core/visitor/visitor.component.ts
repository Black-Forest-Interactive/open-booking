import {Component, computed, resource, signal} from '@angular/core';
import {BookingDetails, BookingSearchRequest, BookingStatus, VerificationStatus, VisitorType} from "@open-booking/core";
import {BookingStatusComponent, toPromise, VerificationStatusComponent} from "@open-booking/shared";
import {ExportService, VisitorService} from "@open-booking/admin";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {toSignal} from "@angular/core/rxjs-interop";
import {debounceTime} from "rxjs";
import {TranslatePipe} from "@ngx-translate/core";
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatChipsModule} from "@angular/material/chips";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {DatePipe} from "@angular/common";
import {SelectionModel} from "@angular/cdk/collections";
import {HotToastService} from "@ngxpert/hot-toast";
import {DateTime} from "luxon";

@Component({
  selector: 'app-visitor',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatCheckboxModule,
    MatCardModule,
    ReactiveFormsModule,
    MainContentComponent,
    TranslatePipe,
    DatePipe,
    BookingStatusComponent,
    VerificationStatusComponent
  ],
  templateUrl: './visitor.component.html',
  styleUrl: './visitor.component.scss',
})
export class VisitorComponent {
  readonly bookingStatuses = Object.values(BookingStatus)
  readonly visitorTypes = Object.values(VisitorType)
  readonly verificationStatuses = Object.values(VerificationStatus)
  readonly columns = ['select', 'offer', 'name', 'email', 'status', 'verification']


  readonly form = new FormGroup({
    fullTextSearch: new FormControl(''),
    status: new FormControl<BookingStatus[]>([BookingStatus.CONFIRMED]),
    visitorType: new FormControl<VisitorType[]>([VisitorType.GROUP]),
    verificationStatus: new FormControl<VerificationStatus[]>([VerificationStatus.CONFIRMED]),
    from: new FormControl<DateTime | null>(null),
    to: new FormControl<DateTime | null>(null),
  })

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(debounceTime(300)),
    {initialValue: this.form.value}
  )

  readonly isSearchActive = computed(() => (this.formValue().fullTextSearch?.length ?? 0) > 0)

  pageNumber = signal(0)
  pageSize = signal(100)

  private readonly request = computed(() => {
    const v = this.formValue()
    return new BookingSearchRequest(
      v.fullTextSearch ?? '',
      v.status ?? [],
      v.visitorType ?? [],
      v.verificationStatus ?? [],
      this.isSearchActive() ? null : v.from?.toISODate() ?? null,
      this.isSearchActive() ? null : v.to?.toISODate() ?? null,
    )
  })

  private visitorCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: this.request()
  }))


  readonly visitorResource = resource({
    params: this.visitorCriteria,
    loader: param => toPromise(this.service.searchVisitor(param.params.request, param.params.page, param.params.size), param.abortSignal)
  })

  private response = computed(() => this.visitorResource.value())
  private page = computed(() => this.response()?.result)
  entries = computed(() => {
    this.selection.clear()
    return this.page()?.content ?? []
  })
  readonly statusCount = computed(() => this.visitorResource.value()?.status);
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.visitorResource.isLoading

// ── Selection ─────────────────────────────────────────────────────────────
  readonly selection = new SelectionModel<BookingDetails>(true, [])

  isAllSelected() {
    return this.selection.selected.length === this.entries().length
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selection.clear()
    } else {
      this.selection.select(...this.entries())
    }
  }

  constructor(private service: VisitorService, private exportService: ExportService, private toast: HotToastService) {
  }

  reset() {
    this.form.reset({
      fullTextSearch: '',
      status: [BookingStatus.CONFIRMED],
      visitorType: [VisitorType.GROUP],
      verificationStatus: [VerificationStatus.CONFIRMED],
      from: null,
      to: null
    })
    this.pageNumber.set(0)
  }

  removeStatus(s: BookingStatus) {
    let status = this.form.controls.status
    if (!status) return
    status.setValue(status.value?.filter(v => v !== s) ?? [])
  }

  removeVisitorType(t: VisitorType) {
    let visitorType = this.form.controls.visitorType
    if (!visitorType) return
    visitorType.setValue(visitorType.value?.filter(v => v !== t) ?? [])
  }

  removeVerificationStatus(v: VerificationStatus) {
    let verificationStatus = this.form.controls.verificationStatus
    if (!verificationStatus) return
    verificationStatus.setValue(verificationStatus.value?.filter(v => v !== v) ?? [])
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }


  export() {
    let reference = this.toast.loading("Download started...")
    this.exportService.exportVisitor(this.request())
      .subscribe({
          error: (e) => {
            reference.close()
            this.toast.error("Failed to generate Excel export")
          },
          complete: () => reference.close()
        }
      )
  }

  notifySelected() {
    const emails = this.selection.selected.map(b => b.visitor.email)

    // this.service.notifyVisitors(targets).subscribe(() =>
    //   this.selectedIds.set(new Set())
    // );
  }

  statusClass(status: BookingStatus) {
    const map: Record<BookingStatus, string> = {
      [BookingStatus.UNKNOWN]: 'bg-gray-100 border-gray-400 text-gray-600',
      [BookingStatus.PENDING]: 'bg-yellow-100 border-yellow-500 text-yellow-800',
      [BookingStatus.CONFIRMED]: 'bg-green-100 border-green-400 text-green-800',
      [BookingStatus.DECLINED]: 'bg-red-100 border-red-400 text-red-800',
      [BookingStatus.CANCELLED]: 'bg-orange-100 border-orange-400 text-orange-800',
      [BookingStatus.EXPIRED]: 'bg-purple-100 border-purple-400 text-purple-800',
    };
    return map[status]
  }

  protected readonly VisitorType = VisitorType;
}
