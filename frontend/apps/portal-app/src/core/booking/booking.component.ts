import {Component, signal} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {BookingCartService} from "./booking-cart.service";
import {BookingRequest, CreateBookingRequest, DayInfoOffer} from "@open-booking/core";
import {Router} from "@angular/router";
import {BookingOfferComponent} from "./booking-offer/booking-offer.component";
import {BookingCheckoutComponent} from "./booking-checkout/booking-checkout.component";
import {BookingSummaryComponent} from "./booking-summary/booking-summary.component";
import {BookingService} from "@open-booking/portal";
import {navigateToDashboard} from "../../app/app.navigation";
import {BookingFailedDialogComponent} from "./booking-failed-dialog/booking-failed-dialog.component";
import {BookingSuccessDialogComponent} from "./booking-success-dialog/booking-success-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-booking',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BookingOfferComponent,
    BookingCheckoutComponent,
    BookingSummaryComponent
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {

  processing = signal(false)

  constructor(
    protected readonly service: BookingCartService,
    private bookingService: BookingService,
    private router: Router,
    private dialog: MatDialog
  ) {

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

  handleConfirm(request: CreateBookingRequest) {
    this.processing.set(true)
    this.bookingService.createBooking(request).subscribe({
      next: v => this.handleResult(v),
      error: err => this.handleError(err),
      complete: () => this.processing.set(false)
    })
  }

  private handleResult(d: BookingRequest) {
    let dialogRef = this.dialog.open(BookingSuccessDialogComponent, {data: d})
    dialogRef.afterClosed().subscribe(() => {
      this.service.clear()
      navigateToDashboard(this.router)
    })
  }

  private handleError(err: any) {
    let dialogRef = this.dialog.open(BookingFailedDialogComponent, {data: err})
    dialogRef.afterClosed().subscribe(() => navigateToDashboard(this.router))
  }
}
