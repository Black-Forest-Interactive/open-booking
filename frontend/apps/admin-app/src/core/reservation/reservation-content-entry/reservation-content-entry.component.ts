import {Component, computed, input} from '@angular/core';
import {ReservationSearchEntry} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDividerModule} from "@angular/material/divider";
import {DatePipe} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";

const classes: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  UNCONFIRMED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  UNKNOWN: 'bg-gray-100 text-gray-800'
}

@Component({
  selector: 'app-reservation-content-entry',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './reservation-content-entry.component.html',
  styleUrl: './reservation-content-entry.component.scss',
})
export class ReservationContentEntryComponent {
  data = input.required<ReservationSearchEntry>()
  reloading = input.required()

  sortedOffers = computed(() => this.data().offers.sort((a, b) => a.priority - b.priority))
  statusClass = computed(() => classes[this.data().reservation.status] || 'bg-gray-100 text-gray-800')
  verificationIcon = computed(() => {
    const status = this.data().visitor.verification.status;
    return status === 'verified' ? 'check_circle' :
      status === 'pending' ? 'schedule' :
        'error';
  })
  verificationIconClass = computed(() => {
    const status = this.data().visitor.verification.status;
    return status === 'verified' ? 'text-green-600' :
      status === 'pending' ? 'text-yellow-600' :
        'text-red-600';
  })


  protected confirmOffer(offerId: number) {

  }

  protected denyReservation() {
    
  }
}
