import {Component, computed, input, output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {Booking, BookingStatus, OfferReference, Visitor} from "@open-booking/core";
import {OfferBookingCapacityComponent} from "../offer-booking-capacity/offer-booking-capacity.component";

@Component({
  selector: 'app-offer-reference',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    DatePipe,
    OfferBookingCapacityComponent,
  ],
  templateUrl: './offer-reference.component.html',
  styleUrl: './offer-reference.component.scss',
})
export class OfferReferenceComponent {

  // Inputs
  entry = input.required<OfferReference>()
  visitor = input.required<Visitor>()
  booking = input.required<Booking>()

  // Output
  confirm = output<OfferReference>()
  decline = output<OfferReference>()

  // Computed properties
  active = computed(() => this.entry().offer.active)
  maxPersons = computed(() => this.entry().offer.maxPersons)
  availableSpace = computed(() => this.entry().assignment.availableSpace)

  hasCapacity = computed(() => this.availableSpace() >= 0)

  canConfirmOffer = computed(() =>
    this.active() &&
    this.booking().status !== BookingStatus.CONFIRMED
  )
  canDeclineOffer = computed(() =>
    this.active() &&
    this.booking().status !== BookingStatus.DECLINED
  )

  protected onConfirm() {
    this.confirm.emit(this.entry())
  }

  protected onDecline() {
    this.decline.emit(this.entry())
  }

  protected readonly BookingStatus = BookingStatus
}
