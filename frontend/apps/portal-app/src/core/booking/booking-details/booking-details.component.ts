import {Component, computed, input, resource, signal} from '@angular/core';
import {BookingService} from "@open-booking/portal";
import {
  BookingStatusComponent,
  GenericRequestResult,
  GenericResultDialogComponent,
  LoadingBarComponent,
  toPromise,
  VerificationStatusComponent,
  VisitorTypeComponent
} from "@open-booking/shared";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {Booking, BookingStatus, VisitorResizeRequest, VisitorType} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {VisitorInfoComponent} from "../../visitor/visitor-info/visitor-info.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {Observable} from "rxjs";
import {HotToastService} from "@ngxpert/hot-toast";
import {MatDialog} from "@angular/material/dialog";
import {BookingResizeDialogComponent} from "../booking-resize-dialog/booking-resize-dialog.component";
import {BookingCancelDialogComponent} from "../booking-cancel-dialog/booking-cancel-dialog.component";
import {BookingFailedDialogComponent} from "../booking-failed-dialog/booking-failed-dialog.component";

interface EditableField {
  isEditing: boolean;
  originalValue: string;
  currentValue: string;
}

@Component({
  selector: 'app-booking-details',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
    TranslatePipe,
    LoadingBarComponent,
    VisitorInfoComponent,
    VisitorTypeComponent,
    VerificationStatusComponent,
    BookingStatusComponent
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent {
  key = input<string>()

  private bookingResource = resource({
    params: this.key,
    loader: param => toPromise(this.service.getBooking(param.params), param.abortSignal)
  })

  processing = signal(false)
  reloading = computed(() => this.bookingResource.isLoading() || this.processing())
  error = this.bookingResource.error
  data = computed(() => this.bookingResource.value())
  isEditable = computed(() => this.status() === BookingStatus.PENDING || this.status() === BookingStatus.CONFIRMED)

  status = computed(() => this.data()?.status ?? BookingStatus.PENDING)
  comment = computed(() => this.data()?.comment ?? '')
  timestamp = computed(() => this.data()?.timestamp ?? '')

  visitor = computed(() => this.data()?.visitor)
  verification = computed(() => this.visitor()?.verification)
  offer = computed(() => this.data()?.offer)
  start = computed(() => this.offer()?.start ?? '')
  finish = computed(() => this.offer()?.finish ?? '')
  maxPersons = computed(() => this.offer()?.maxPersons ?? 0)

  type = computed(() => this.data()?.visitor.type ?? VisitorType.SINGLE)
  size = computed(() => this.data()?.visitor.size ?? 0)
  title = computed(() => this.data()?.visitor.title ?? '')
  name = computed(() => this.data()?.visitor.name ?? '')
  email = computed(() => this.data()?.visitor.email ?? '')
  phone = computed(() => this.data()?.visitor.phone ?? '')
  minAge = computed(() => this.data()?.visitor.minAge ?? 0)
  maxAge = computed(() => this.data()?.visitor.maxAge ?? 0)
  description = computed(() => this.data()?.visitor.description ?? '')
  zip = computed(() => this.data()?.visitor.address.zip ?? '')
  city = computed(() => this.data()?.visitor.address.city ?? '')


  // Editable field signals - just track editing state and temp values
  private editingField = signal<'email' | 'phone' | 'comment' | undefined>(undefined)
  editingValue = signal('')

  emailField = computed(() => ({
    isEditing: this.editingField() === 'email',
    currentValue: this.visitor()?.email || ''
  }))

  phoneField = computed(() => ({
    isEditing: this.editingField() === 'phone',
    currentValue: this.visitor()?.phone || ''
  }))

  commentField = computed(() => ({
    isEditing: this.editingField() === 'comment',
    currentValue: this.data()?.comment || ''
  }))

  constructor(
    private service: BookingService,
    private dialog: MatDialog,
    private toast: HotToastService
  ) {
  }


  // Edit functionality
  startEdit(field: 'email' | 'phone' | 'comment') {
    if (!this.isEditable()) return

    this.editingField.set(field)

    switch (field) {
      case 'email':
        this.editingValue.set(this.visitor()?.email || '')
        break;
      case 'phone':
        this.editingValue.set(this.visitor()?.phone || '')
        break;
      case 'comment':
        this.editingValue.set(this.data()?.comment || '')
        break;
    }
  }

  saveEdit(field: 'email' | 'phone' | 'comment') {
    let response = this.getResponse(field)
    if (!response) return

    response.subscribe({
      next: () => {
        this.resetEditState(field)
        this.bookingResource.reload()
      },
      error: (err) => {
        console.error(`Failed to update ${field}:`, err);
        this.toast.error('Update failed')
      }
    })
  }

  private getResponse(field: 'email' | 'phone' | 'comment'): Observable<Booking> | undefined {
    const value = this.editingValue()
    let key = this.key()
    if (!key) return
    debugger
    if (field === 'email') {
      return this.service.updateEmail(key, value)
    } else if (field === 'phone') {
      return this.service.updatePhone(key, value)
    } else if (field === 'comment') {
      return this.service.updateComment(key, value)
    }
    return undefined
  }

  cancelEdit(field: 'email' | 'phone' | 'comment') {
    this.resetEditState(field);
  }

  private resetEditState(field: 'email' | 'phone' | 'comment') {
    this.editingField.set(undefined)
    this.editingValue.set('')
  }

  updateSize() {
    let dialogRef = this.dialog.open(BookingResizeDialogComponent, {data: this.data()})
    dialogRef.afterClosed().subscribe(value => {
      if (value) this.handleResize(value as VisitorResizeRequest)
    })
  }

  private handleResize(request: VisitorResizeRequest) {
    this.processing.set(true)
    this.service.updateSize(this.key()!!, request).subscribe({
      next: _ => this.bookingResource.reload(),
      complete: () => this.processing.set(false)
    })
  }

  cancel() {
    let dialogRef = this.dialog.open(BookingCancelDialogComponent, {data: this.data()})
    dialogRef.afterClosed().subscribe(value => {
      if (value) this.handleCancel(this.key()!!)
    })
  }

  private handleCancel(key: string) {
    this.processing.set(true)
    this.service.cancelBooking(key).subscribe({
      next: v => this.handleResult(v),
      error: err => this.handleError(err),
      complete: () => this.processing.set(false)
    })
  }

  private handleResult(response: GenericRequestResult) {
    let dialogRef = this.dialog.open(GenericResultDialogComponent, {data: response})
    dialogRef.afterClosed().subscribe(() => {
      this.bookingResource.reload()
    })
  }

  private handleError(err: any) {
    let dialogRef = this.dialog.open(BookingFailedDialogComponent, {data: err})
    dialogRef.afterClosed().subscribe(() => this.bookingResource.reload())
  }
}
