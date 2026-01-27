import {Component, computed, input, output, signal} from '@angular/core';
import {BookingConfirmationContent, BookingRequestInfo} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RequestService} from "@open-booking/admin";
import {MatDialog} from "@angular/material/dialog";
import {RequestProcessDialogComponent} from "../request-process-dialog/request-process-dialog.component";
import {GenericRequestResult} from "@open-booking/shared";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslateService} from "@ngx-translate/core";
import {RequestChangeResultComponent} from "../request-change-result/request-change-result.component";
import {tap} from "rxjs";
import {MatRadioModule} from "@angular/material/radio";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-request-booking-entry',
  imports: [
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './request-booking-entry.component.html',
  styleUrl: './request-booking-entry.component.scss',
})
export class RequestBookingEntryComponent {

  data = input.required<BookingRequestInfo>()
  change = output<boolean>()

  bookings = computed(() => this.data().bookings ?? [])

  fg: FormGroup

  changing = signal(false)


  constructor(
    private fb: FormBuilder,
    private service: RequestService,
    private toast: HotToastService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.fg = this.fb.group({
      booking: ['', Validators.required],
    })
  }

  confirm() {
    if (this.fg.invalid) return
    if (this.changing()) return
    let selectedBookingId = this.fg.value.booking
    let selectedBooking = this.data().bookings.find(b => b.id == selectedBookingId)
    if (!selectedBooking) return

    let id = this.data().id


    let dialogRef = this.dialog.open(RequestProcessDialogComponent, {
      data: {info: this.data(), selectedBooking: selectedBooking, confirmation: true},
      height: '800px',
      width: '800px',
    })

    dialogRef.afterClosed().subscribe(
      {
        next: value => {
          if (value) {
            let content = value as BookingConfirmationContent
            this.service.confirmBookingRequest(id, selectedBooking.id, content)
              .pipe(tap(result => this.handleBookingChangeResult(result)))
              .subscribe(result => {
                if (result) this.change.emit(true)
              })
          }
        },
        complete: () => this.changing.set(false)

      }
    )
  }

  denial() {
    if (this.changing()) return
    this.changing.set(true)

    let selectedBooking = this.data().bookings[0]
    let id = this.data().id

    let dialogRef = this.dialog.open(RequestProcessDialogComponent, {
      data: {info: this.data(), selectedBooking: selectedBooking, confirmation: true},
      height: '800px',
      width: '800px',
    })

    dialogRef.afterClosed().subscribe(
      {
        next: value => {
          if (value) {
            let content = value as BookingConfirmationContent
            this.service.denyBookingRequest(id, content)
              .pipe(tap(result => this.handleBookingChangeResult(result)))
              .subscribe(result => {
                if (result) this.change.emit(true)
              })
          }
        },
        complete: () => this.changing.set(false)

      }
    )
  }

  private handleBookingChangeResult(result: GenericRequestResult) {
    if (result.success) {
      this.toast.success(RequestChangeResultComponent, {data: {result: result, data: this.data()}})
    } else {
      let message = this.translate.instant(result.msg)
      this.toast.error(message)
    }
  }
}
