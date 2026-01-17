import {Component, input, output, signal} from '@angular/core';
import {
  ReservationConfirmationContent,
  ReservationDetails,
  ReservationOffer,
  ReservationStatus
} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDividerModule} from "@angular/material/divider";
import {DatePipe} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ReservationService} from "@open-booking/admin";
import {ReservationProcessDialogComponent} from "../reservation-process-dialog/reservation-process-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {EMPTY, switchMap} from "rxjs";
import {
  ReservationContentEntryOfferComponent
} from "../reservation-content-entry-offer/reservation-content-entry-offer.component";
import {VisitorConfirmComponent} from "../../visitor/visitor-confirm/visitor-confirm.component";
import {VisitorTitleComponent} from "../../visitor/visitor-title/visitor-title.component";
import {VisitorSizeComponent} from "../../visitor/visitor-size/visitor-size.component";
import {ReservationStatusComponent, VerificationStatusComponent, VisitorTypeComponent} from "@open-booking/shared";

@Component({
  selector: 'app-reservation-content-entry',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    TranslatePipe,
    DatePipe,
    ReservationContentEntryOfferComponent,
    VisitorConfirmComponent,
    ReservationStatusComponent,
    VisitorTypeComponent,
    VisitorTitleComponent,
    VisitorSizeComponent,
    ReservationStatusComponent,
    VerificationStatusComponent,
    VisitorTypeComponent
  ],
  templateUrl: './reservation-content-entry.component.html',
  styleUrl: './reservation-content-entry.component.scss',
})
export class ReservationContentEntryComponent {
  data = input.required<ReservationDetails>()
  reloading = input.required()
  reload = output<boolean>()
  back = output<boolean>()

  showBackButton = input(false)

  updating = signal(false)

  constructor(
    private service: ReservationService,
    private dialog: MatDialog
  ) {
  }


  protected confirmOffer(offer: ReservationOffer) {
    this.updating.set(true)
    let dialogRef = this.dialog.open(ReservationProcessDialogComponent, {
      data: {info: this.data(), offer: offer, confirmation: true},
      height: '800px',
      width: '800px',
    })

    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (!result) {
          this.updating.set(false)
          return EMPTY
        }
        let content = result as ReservationConfirmationContent
        return this.service.confirmReservation(this.data().reservation.id, content)
      })
    ).subscribe({
      complete: () => {
        this.updating.set(false)
        this.reload.emit(true)
      }
    })
  }


  protected denyReservation() {
    this.updating.set(true)
    let dialogRef = this.dialog.open(ReservationProcessDialogComponent, {
      data: {info: this.data(), confirmation: false},
      height: '800px',
      width: '800px',
    })

    dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (!result) {
          this.updating.set(false)
          return EMPTY
        }
        let content = result as ReservationConfirmationContent
        return this.service.denyReservation(this.data().reservation.id, content)
      })
    ).subscribe({
      complete: () => {
        this.updating.set(false)
        this.reload.emit(true)
      }
    })
  }

  protected readonly ReservationStatus = ReservationStatus;

}
