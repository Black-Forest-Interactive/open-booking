import {Component, computed, input, output, signal} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {AddressPipe, OfferReservationEntry, ReservationStatus} from "@open-booking/core";

@Component({
  selector: 'app-dashboard-content-entry-reservation',
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    AddressPipe,
  ],
  templateUrl: './dashboard-content-entry-reservation.component.html',
  styleUrl: './dashboard-content-entry-reservation.component.scss',
})
export class DashboardContentEntryReservationComponent {

  reservation = input.required<OfferReservationEntry>()

  confirmReservation = output<OfferReservationEntry>()

  isExpanded = signal(false)
  isConfirmed = computed(() => this.reservation().status === ReservationStatus.CONFIRMED)
  comment = computed(() => "")
  emailSent = computed(() => false)
  emailDelivered = computed(() => false)

  toggleExpand(): void {
    this.isExpanded.update(value => !value)
  }

  handleConfirm(): void {
    this.confirmReservation.emit(this.reservation())
  }

  protected readonly ReservationStatus = ReservationStatus;
}
