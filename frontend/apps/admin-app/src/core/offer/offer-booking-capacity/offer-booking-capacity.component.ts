import {Component, computed, input} from '@angular/core';
import {Assignment, BookingStatus, Offer} from "@open-booking/core";
import {TranslatePipe} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-offer-booking-capacity',
  imports: [
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './offer-booking-capacity.component.html',
  styleUrl: './offer-booking-capacity.component.scss',
})
export class OfferBookingCapacityComponent {
  // Inputs
  offer = input.required<Offer>()
  assignment = input.required<Assignment>()
  visitorSize = input.required<number>()
  status = input.required<BookingStatus>()

  // Computed properties
  active = computed(() => this.offer().active)
  maxPersons = computed(() => this.offer().maxPersons)
  confirmedSpace = computed(() => this.assignment().confirmedSpace)
  pendingSpace = computed(() => this.assignment().pendingSpace)
  availableSpace = computed(() => this.assignment().availableSpace)

  isPending = computed(() => this.status() === BookingStatus.PENDING)

  // Calculate reserved space excluding current visitor group
  otherPendingSpace = computed(() => {
    if (this.isPending()) {
      return Math.max(0, this.pendingSpace() - this.visitorSize())
    }
    return this.pendingSpace()
  });

  usedCapacity = computed(() => this.confirmedSpace() + this.pendingSpace())

  confirmedPercentage = computed(() => (this.confirmedSpace() / this.maxPersons()) * 100)

  otherPendingPercentage = computed(() => (this.otherPendingSpace() / this.maxPersons()) * 100)

  visitorPercentage = computed(() => (this.visitorSize() / this.maxPersons()) * 100)

  availablePercentage = computed(() => (this.availableSpace() / this.maxPersons()) * 100)

  remainingAfterConfirmation = computed(() => this.availableSpace() - this.visitorSize())

  hasCapacity = computed(() => this.availableSpace() >= this.visitorSize())
}
