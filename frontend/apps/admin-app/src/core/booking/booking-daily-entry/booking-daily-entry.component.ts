import {Component, computed, input, resource} from '@angular/core';
import {Booking, BookingDetails, Offer} from "@open-booking/core";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {BookingService} from "@open-booking/admin";
import {Router} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {navigateToBookingDetails} from "../booking.routes";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-booking-daily-entry',
  imports: [
    MatIconModule,
    LoadingBarComponent,
    TranslatePipe
  ],
  templateUrl: './booking-daily-entry.component.html',
  styleUrl: './booking-daily-entry.component.scss',
})
export class BookingDailyEntryComponent {
  offer = input.required<Offer>()

  private bookingDetailsResource = resource({
    params: this.offer,
    loader: param => toPromise(this.service.findBookingDetailsByOffer(param.params.id), param.abortSignal)
  })

  reloading = computed(() => this.bookingDetailsResource.isLoading())
  bookings = computed(() => this.bookingDetailsResource.value() ?? [])
  data = computed(() => this.bookings().map(b => {
    return {booking: b.booking, visitor: b.visitor, width: this.getWidth(b)}
  }))


  constructor(private service: BookingService, private router: Router) {
  }

  protected showDetails(b: Booking) {
    navigateToBookingDetails(this.router, b.id)
  }

  private getWidth(b: BookingDetails): number {
    let totalSize = this.offer().maxPersons
    return Math.abs(b.visitor.size / totalSize * 12)
  }
}

