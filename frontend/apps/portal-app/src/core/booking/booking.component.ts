import {Component} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingCartService} from "./booking-cart.service";
import {DayInfoOffer} from "@open-booking/core";
import {BookingEntryComponent} from "./booking-entry/booking-entry.component";
import {Router} from "@angular/router";
import {navigateToBookingCheckout} from "../../app/app.navigation";

@Component({
  selector: 'app-booking',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslatePipe,
    BookingEntryComponent
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {


  constructor(protected readonly service: BookingCartService, private router: Router) {

  }

  getAvailableSpaces(item: DayInfoOffer): number {
    const maxPersons = item.offer.maxPersons
    const confirmed = item.space.CONFIRMED || 0
    const unconfirmed = item.space.UNCONFIRMED || 0

    return maxPersons - confirmed - unconfirmed;
  }

  hasUnavailableItems(): boolean {
    return Array.from(this.service.entries()).some(item =>
      this.getAvailableSpaces(item) === 0
    )
  }


  protected proceedToCheckout() {
    if (this.service.entries().length > 0) {
      navigateToBookingCheckout(this.router)
    }
  }

}
