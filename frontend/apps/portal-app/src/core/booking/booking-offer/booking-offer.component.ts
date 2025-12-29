import {Component, input, output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingEntryComponent} from "../booking-entry/booking-entry.component";
import {DayInfoOffer} from "@open-booking/core";

@Component({
  selector: 'app-booking-offer',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslatePipe,
    BookingEntryComponent
  ],
  templateUrl: './booking-offer.component.html',
  styleUrl: './booking-offer.component.scss',
})
export class BookingOfferComponent {

  entries = input.required<DayInfoOffer[]>()
  maxGroupSize = input.required<number>()
  
  checkout = output<boolean>()


  getAvailableSpaces(item: DayInfoOffer): number {
    const maxPersons = item.offer.maxPersons
    const confirmed = item.space.CONFIRMED || 0
    const unconfirmed = item.space.UNCONFIRMED || 0

    return maxPersons - confirmed - unconfirmed;
  }

  hasUnavailableItems(): boolean {
    return Array.from(this.entries()).some(item =>
      this.getAvailableSpaces(item) === 0
    )
  }

  protected proceedToCheckout() {
    this.checkout.emit(true)

  }
}
