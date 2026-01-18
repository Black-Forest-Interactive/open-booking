import {Component, computed, input} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {Reservation, ReservationOffer, ReservationStatus, Visitor} from "@open-booking/core";

@Component({
  selector: 'app-reservation-offer-capacity-visualization',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './reservation-offer-capacity-visualization.component.html',
  styleUrl: './reservation-offer-capacity-visualization.component.scss',
})
export class ReservationOfferCapacityVisualizationComponent {
  // Inputs
  entry = input.required<ReservationOffer>()
  visitor = input.required<Visitor>()
  reservation = input.required<Reservation>()

  // Computed properties
  active = computed(() => this.entry().offer.active)
  maxPersons = computed(() => this.entry().offer.maxPersons)
  bookedSpace = computed(() => this.entry().assignment.confirmedSpace)
  reservedSpace = computed(() => this.entry().assignment.pendingSpace)
  availableSpace = computed(() => this.entry().assignment.availableSpace)

  isUnconfirmed = computed(() =>
    this.reservation().status === ReservationStatus.UNCONFIRMED
  );

  // Calculate reserved space excluding current visitor group
  otherReservedSpace = computed(() => {
    if (this.isUnconfirmed()) {
      return Math.max(0, this.reservedSpace() - this.visitor().size)
    }
    return this.reservedSpace()
  });

  usedCapacity = computed(() => this.bookedSpace() + this.reservedSpace())

  bookedPercentage = computed(() => (this.bookedSpace() / this.maxPersons()) * 100)

  otherReservedPercentage = computed(() => (this.otherReservedSpace() / this.maxPersons()) * 100)

  visitorPercentage = computed(() => (this.visitor().size / this.maxPersons()) * 100)

  remainingAfterConfirmation = computed(() => this.availableSpace() - this.visitor().size)

  hasCapacity = computed(() => this.availableSpace() >= this.visitor().size)
}
