import {Component, signal} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {BookingProcessService} from "./booking-process.service";
import {Router} from "@angular/router";
import {BookingCheckoutComponent} from "./booking-checkout/booking-checkout.component";
import {BookingSummaryComponent} from "./booking-summary/booking-summary.component";
import {navigateToDashboard} from "../../app/app.navigation";
import {BookingFailedDialogComponent} from "./booking-failed-dialog/booking-failed-dialog.component";
import {BookingSuccessDialogComponent} from "./booking-success-dialog/booking-success-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingService, CreateBookingRequest, CreateBookingResponse} from "@open-booking/portal";
import {DateTime} from "luxon";

@Component({
  selector: 'app-booking',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BookingCheckoutComponent,
    BookingSummaryComponent,
    TranslatePipe
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {

  processing = signal(false)

  constructor(
    protected readonly service: BookingProcessService,
    private bookingService: BookingService,
    private router: Router,
    private dialog: MatDialog
  ) {

  }


  handleConfirm(request: CreateBookingRequest) {
    this.processing.set(true)
    this.bookingService.createBooking(request).subscribe({
      next: v => this.handleResult(v),
      error: err => this.handleError(err),
      complete: () => this.processing.set(false)
    })
  }

  private handleResult(response: CreateBookingResponse) {
    if (response.success) {
      let dialogRef = this.dialog.open(BookingSuccessDialogComponent, {data: response.response})
      dialogRef.afterClosed().subscribe(() => {
        this.service.clear()
        navigateToDashboard(this.router)
      })
    } else {
      let dialogRef = this.dialog.open(BookingFailedDialogComponent, {data: response.response})
      dialogRef.afterClosed().subscribe(() => {
        this.service.clear()
        navigateToDashboard(this.router)
      })
    }
  }

  private handleError(err: any) {
    let dialogRef = this.dialog.open(BookingFailedDialogComponent, {data: err})
    dialogRef.afterClosed().subscribe(() => navigateToDashboard(this.router))
  }

  protected onBack() {
    let selectedOffer = this.service.selectedOffer()
    if (selectedOffer) {
      let day = DateTime.fromISO(selectedOffer.offer.start, {zone: 'utc'}).toISODate()
      this.router.navigate(["details", day]).then()
    } else {
      this.router.navigate(["/"]).then()
    }
  }
}
