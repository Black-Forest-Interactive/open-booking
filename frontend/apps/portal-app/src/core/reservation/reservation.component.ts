import {Component, signal} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {ReservationProcessService} from "./reservation-process.service";
import {Reservation} from "@open-booking/core";
import {Router} from "@angular/router";
import {ReservationOfferComponent} from "./reservation-offer/reservation-offer.component";
import {ReservationCheckoutComponent} from "./reservation-checkout/reservation-checkout.component";
import {ReservationSummaryComponent} from "./reservation-summary/reservation-summary.component";
import {CreateReservationRequest, ReservationService} from "@open-booking/portal";
import {navigateToDashboard} from "../../app/app.navigation";
import {ReservationFailedDialogComponent} from "./reservation-failed-dialog/reservation-failed-dialog.component";
import {ReservationSuccessDialogComponent} from "./reservation-success-dialog/reservation-success-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-reservation',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReservationOfferComponent,
    ReservationCheckoutComponent,
    ReservationSummaryComponent
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {

  processing = signal(false)

  constructor(
    protected readonly service: ReservationProcessService,
    private reservationService: ReservationService,
    private router: Router,
    private dialog: MatDialog
  ) {

  }


  handleConfirm(request: CreateReservationRequest) {
    this.processing.set(true)
    this.reservationService.createReservation(request).subscribe({
      next: v => this.handleResult(v),
      error: err => this.handleError(err),
      complete: () => this.processing.set(false)
    })
  }

  private handleResult(d: Reservation) {
    let dialogRef = this.dialog.open(ReservationSuccessDialogComponent, {data: d})
    dialogRef.afterClosed().subscribe(() => {
      this.service.clear()
      navigateToDashboard(this.router)
    })
  }

  private handleError(err: any) {
    let dialogRef = this.dialog.open(ReservationFailedDialogComponent, {data: err})
    dialogRef.afterClosed().subscribe(() => navigateToDashboard(this.router))
  }
}
