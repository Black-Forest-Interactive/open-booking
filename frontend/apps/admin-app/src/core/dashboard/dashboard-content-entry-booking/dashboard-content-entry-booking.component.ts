import {Component, input, output, signal} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {AddressPipe, BookingEntry} from "@open-booking/core";

@Component({
  selector: 'app-dashboard-content-entry-booking',
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    AddressPipe,
  ],
  templateUrl: './dashboard-content-entry-booking.component.html',
  styleUrl: './dashboard-content-entry-booking.component.scss',
})
export class DashboardContentEntryBookingComponent {

  booking = input.required<BookingEntry>()

  confirmBooking = output<BookingEntry>()

  isExpanded = signal(false);

  toggleExpand(): void {
    this.isExpanded.update(value => !value)
  }

  handleConfirm(): void {
    this.confirmBooking.emit(this.booking())
  }
}
