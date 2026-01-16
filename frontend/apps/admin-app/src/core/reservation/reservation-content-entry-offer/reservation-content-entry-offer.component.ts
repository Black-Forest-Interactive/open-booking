import {Component, computed, input, output} from '@angular/core';
import {Reservation, ReservationOffer, ReservationStatus, Visitor} from "@open-booking/core";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {
  ReservationOfferCapacityVisualizationComponent
} from "../reservation-offer-capacity-visualization/reservation-offer-capacity-visualization.component";

@Component({
  selector: 'app-reservation-content-entry-offer',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    DatePipe,
    ReservationOfferCapacityVisualizationComponent
  ],
  templateUrl: './reservation-content-entry-offer.component.html',
  styleUrl: './reservation-content-entry-offer.component.scss',
})
export class ReservationContentEntryOfferComponent {

  // Inputs
  entry = input.required<ReservationOffer>()
  visitor = input.required<Visitor>()
  reservation = input.required<Reservation>()

  // Output
  confirm = output<ReservationOffer>()

  // Computed properties
  active = computed(() => this.entry().offer.active)
  maxPersons = computed(() => this.entry().offer.maxPersons)
  bookedSpace = computed(() => this.entry().assignment.bookedSpace)
  reservedSpace = computed(() => this.entry().assignment.reservedSpace)
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

  reservedPercentage = computed(() => (this.reservedSpace() / this.maxPersons()) * 100)

  visitorPercentage = computed(() => (this.visitor().size / this.maxPersons()) * 100)

  remainingAfterConfirmation = computed(() => this.availableSpace() - this.visitor().size)

  hasCapacity = computed(() => this.availableSpace() >= this.visitor().size)

  canConfirmOffer = computed(() =>
    this.active() &&
    this.reservation().status !== ReservationStatus.CONFIRMED
  )


  protected onConfirm() {
    this.confirm.emit(this.entry())
  }

  protected readonly ReservationStatus = ReservationStatus;
}
