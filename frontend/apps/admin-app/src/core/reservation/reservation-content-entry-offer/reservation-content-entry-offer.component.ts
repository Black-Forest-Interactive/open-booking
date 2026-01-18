import {Component, computed, input, output} from '@angular/core';
import {Booking, BookingStatus, OfferReference, Visitor} from "@open-booking/core";
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
  entry = input.required<OfferReference>()
  visitor = input.required<Visitor>()
  booking = input.required<Booking>()

  // Output
  confirm = output<OfferReference>()

  // Computed properties
  active = computed(() => this.entry().offer.active)
  maxPersons = computed(() => this.entry().offer.maxPersons)
  availableSpace = computed(() => this.entry().assignment.availableSpace)

  hasCapacity = computed(() => this.availableSpace() >= this.visitor().size)

  canConfirmOffer = computed(() =>
    this.active() &&
    this.booking().status !== BookingStatus.CONFIRMED
  )

  protected onConfirm() {
    this.confirm.emit(this.entry())
  }

  protected readonly BookingStatus = BookingStatus;
}
