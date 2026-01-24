import {Component, computed, input, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {BookingDetails, BookingStatus, OfferSearchEntry} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingListEntryComponent} from "../../booking/booking-list-entry/booking-list-entry.component";
import {MatDialog} from "@angular/material/dialog";
import {BookingDetailsDialogComponent} from "../../booking/booking-details-dialog/booking-details-dialog.component";
import {OfferAssignmentComponent} from "../../offer/offer-assignment/offer-assignment.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {BookingCreateDialogComponent} from "../../booking/booking-create-dialog/booking-create-dialog.component";

@Component({
  selector: 'app-dashboard-content-entry',
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    DatePipe,
    TranslatePipe,
    BookingListEntryComponent,
    OfferAssignmentComponent,
    MatButton,
    MatIconButton
  ],
  templateUrl: './dashboard-content-entry.component.html',
  styleUrl: './dashboard-content-entry.component.scss',
})
export class DashboardContentEntryComponent {
  data = input.required<OfferSearchEntry>()

  availableSpace = computed(() => this.data().assignment.availableSpace)

  bookings = computed(() => this.data().bookings ?? [])

  showAll = signal(false)
  filteredBookings = computed(() => this.showAll() ? this.bookings() : this.bookings().filter(b => b.booking.status === BookingStatus.PENDING || b.booking.status === BookingStatus.CONFIRMED))

  constructor(private dialog: MatDialog) {
  }

  protected showDetails(entry: BookingDetails) {
    this.dialog.open(BookingDetailsDialogComponent, {
      disableClose: true,
      data: entry,
      width: 'auto',
      maxWidth: 'none',
      height: 'auto',
      maxHeight: 'none',
    })
  }

  protected createBooking() {
    this.dialog.open(BookingCreateDialogComponent, {
      disableClose: true,
      data: {offer: this.data().info, assignment: this.data().assignment},
      width: 'auto',
      maxWidth: 'none',
      height: 'auto',
      maxHeight: '90vh',
    })
  }
}
