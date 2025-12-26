import {Component, computed, input, signal} from '@angular/core';
import {Booking, ShowOffer} from "@open-booking/admin";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {HotToastService} from "@ngxpert/hot-toast";

@Component({
  selector: 'app-dashboard-content-entry',
  imports: [
    MatIcon,
    MatIconButton,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './dashboard-content-entry.component.html',
  styleUrl: './dashboard-content-entry.component.scss',
})
export class DashboardContentEntryComponent {
  data = input.required<ShowOffer>()

  confirmedOnly = signal<boolean>(false)
  bookedSeats = computed(() => this.getBookedSeats(this.data().bookings, this.confirmedOnly()))
  availableSeats = computed(() => this.getAvailableSeats(this.data().totalSeats, this.bookedSeats()))
  confirmedSeats = computed(() => this.getConfirmedSeats(this.data().bookings))
  pendingSeats = computed(() => this.getPendingSeats(this.data().bookings))

  collapsed = signal<boolean>(false)

  private getBookedSeats(bookings: Booking[], confirmedOnly = false): number {
    return bookings
      .filter(b => !confirmedOnly || b.confirmed)
      .reduce((sum, b) => sum + b.guests, 0);
  }

  private getConfirmedSeats(bookings: Booking[]): number {
    return bookings.filter(b => b.confirmed)
      .reduce((sum, b) => sum + b.guests, 0)
  }

  private getPendingSeats(bookings: Booking[]): number {
    return bookings.filter(b => !b.confirmed)
      .reduce((sum, b) => sum + b.guests, 0)
  }


  private getAvailableSeats(totalSeats: number, confirmedSeats: number): number {
    return totalSeats - confirmedSeats
  }

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
}
