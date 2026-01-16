import {Component, computed, input} from '@angular/core';
import {Reservation} from "@open-booking/core";
import {TranslatePipe} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";

const classes: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  UNCONFIRMED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  UNKNOWN: 'bg-gray-100 text-gray-800'
}

@Component({
  selector: 'app-reservation-status',
  imports: [
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './reservation-status.component.html',
  styleUrl: './reservation-status.component.scss',
})
export class ReservationStatusComponent {
  data = input.required<Reservation>()
  statusClass = computed(() => classes[this.data().status] || 'bg-gray-100 text-gray-800')
}
