import {Component, computed, input, output, signal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {HotToastService} from "@ngxpert/hot-toast";
import {
  DashboardContentEntryBookingComponent
} from "../dashboard-content-entry-booking/dashboard-content-entry-booking.component";
import {BookingEntry, OfferEntry} from "@open-booking/core";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-dashboard-content-entry',
  imports: [
    MatIcon,
    MatIconButton,
    MatFormFieldModule,
    MatSelectModule,
    DashboardContentEntryBookingComponent,
    DatePipe
  ],
  templateUrl: './dashboard-content-entry.component.html',
  styleUrl: './dashboard-content-entry.component.scss',
})
export class DashboardContentEntryComponent {
  data = input.required<OfferEntry>()

  availableSeats = computed(() => this.data().totalSeats)
  confirmedSeats = computed(() => this.data().confirmedSeats)
  pendingSeats = computed(() => this.data().pendingSeats)

  collapsed = signal<boolean>(false)

  confirmBooking = output<BookingEntry>()

  constructor(private toast: HotToastService) {
  }


  protected toggleEditingColor() {
    this.toast.error("Change color is not implemented yet")
  }

  protected toggleShowCollapse() {
    this.collapsed.set(!this.collapsed())
  }


  protected selectGuide() {
    this.toast.error("Select guide is not implemented yet")
  }

  protected handleConfirmBooking(booking: BookingEntry) {
    this.confirmBooking.emit(booking)
  }
}
