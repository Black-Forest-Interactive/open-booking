import {Component, computed, input} from '@angular/core';
import {ReservationStatus} from '@open-booking/core'
import {MatIconModule} from "@angular/material/icon";
import {StatusBadgeComponent} from "@open-booking/shared";

const classes: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  UNCONFIRMED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  UNKNOWN: 'bg-gray-100 text-gray-800'
}

@Component({
  selector: 'lib-reservation-status',
  imports: [
    MatIconModule,
    StatusBadgeComponent
  ],
  templateUrl: './reservation-status.component.html',
  styleUrl: './reservation-status.component.scss',
})
export class ReservationStatusComponent {
  status = input.required<ReservationStatus>()
  showText = input(true)
  statusClass = computed(() => classes[this.status()] || 'bg-gray-100 text-gray-800')
  text = computed(() => 'RESERVATION.Status.' + this.status())
}
