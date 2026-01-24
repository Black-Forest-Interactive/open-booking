import {Component, computed, input} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {Booking, BookingStatus, OfferReference, Visitor} from "@open-booking/core";

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
  entry = input.required<OfferReference>()
  visitor = input.required<Visitor>()
  booking = input.required<Booking>()

  // Computed properties
  active = computed(() => this.entry().offer.active)
  maxPersons = computed(() => this.entry().offer.maxPersons)
  confirmedSpace = computed(() => this.entry().assignment.confirmedSpace)
  pendingSpace = computed(() => this.entry().assignment.pendingSpace)
  availableSpace = computed(() => this.entry().assignment.availableSpace)

  isPending = computed(() =>
    this.booking().status === BookingStatus.PENDING
  );

  // Calculate reserved space excluding current visitor group
  otherPendingSpace = computed(() => {
    if (this.isPending()) {
      return Math.max(0, this.pendingSpace() - this.visitor().size)
    }
    return this.pendingSpace()
  });

  usedCapacity = computed(() => this.confirmedSpace() + this.pendingSpace())

  confirmedPercentage = computed(() => (this.confirmedSpace() / this.maxPersons()) * 100)

  otherPendingPercentage = computed(() => (this.otherPendingSpace() / this.maxPersons()) * 100)

  visitorPercentage = computed(() => (this.visitor().size / this.maxPersons()) * 100)

  remainingAfterConfirmation = computed(() => this.availableSpace() - this.visitor().size)

  hasCapacity = computed(() => this.availableSpace() >= this.visitor().size)
}
