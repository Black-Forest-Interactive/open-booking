import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BookingRequestService} from "../model/booking-request.service";
import {BookingRequestInfo, defaultBookingRequestInfo} from "../model/booking-request-api";

@Component({
  selector: 'app-request-board-booking-cell',
  templateUrl: './request-board-booking-cell.component.html',
  styleUrls: ['./request-board-booking-cell.component.scss']
})
export class RequestBoardBookingCellComponent {
  @Input() data: BookingRequestInfo = defaultBookingRequestInfo
  @Output() change = new EventEmitter<Boolean>()
  fg: FormGroup = this.fb.group({
    booking: ['', Validators.required],
  })

  changing: boolean = false


  constructor(
    private fb: FormBuilder,
    private service: BookingRequestService,
  ) {
  }

  confirm() {
    if (this.fg.invalid) return
    if (this.changing) return
    let selectedBookingId = this.fg.value.booking
    let selectedBooking = this.data.bookings.find(b => b.id == selectedBookingId)
    if (!selectedBooking) return

    this.service.confirmBooking(selectedBooking, this.data).subscribe(result => {
      if (result) this.change.emit(true)
    })
  }

  denial() {
    if (this.changing) return
    this.changing = true

    let selectedBooking = this.data.bookings[0]
    this.service.denialBooking(selectedBooking, this.data).subscribe(result => {
      if (result) this.change.emit(true)
    })
  }

}
