import {Component, input, output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {TranslatePipe} from "@ngx-translate/core";
import {ReservationEntryComponent} from "../reservation-entry/reservation-entry.component";
import {DayInfoOffer} from "@open-booking/core";
import {navigateToDashboard} from "../../../app/app.navigation";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reservation-offer',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslatePipe,
    ReservationEntryComponent
  ],
  templateUrl: './reservation-offer.component.html',
  styleUrl: './reservation-offer.component.scss',
})
export class ReservationOfferComponent {

  entries = input.required<DayInfoOffer[]>()
  maxGroupSize = input.required<number>()

  checkout = output<boolean>()

  constructor(private router: Router) {
  }

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

  protected addMoreItems() {
    navigateToDashboard(this.router)
  }
}
