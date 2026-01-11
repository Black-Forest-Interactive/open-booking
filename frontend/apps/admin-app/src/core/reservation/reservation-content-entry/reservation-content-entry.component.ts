import {Component, computed, input, output, signal} from '@angular/core';
import {
  ReservationConfirmationContent,
  ReservationDetails,
  ReservationOffer,
  ReservationStatus,
  VerificationStatus,
  VisitorType
} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDividerModule} from "@angular/material/divider";
import {DatePipe} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ReservationService, VisitorService} from "@open-booking/admin";
import {ReservationProcessDialogComponent} from "../reservation-process-dialog/reservation-process-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {EMPTY, switchMap} from "rxjs";
import {
  ReservationContentEntryOfferComponent
} from "../reservation-content-entry-offer/reservation-content-entry-offer.component";
import {VisitorConfirmComponent} from "../../visitor/visitor-confirm/visitor-confirm.component";

const classes: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  UNCONFIRMED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  UNKNOWN: 'bg-gray-100 text-gray-800'
}

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
    VisitorConfirmComponent
  ],
  templateUrl: './reservation-content-entry.component.html',
  styleUrl: './reservation-content-entry.component.scss',
})
export class ReservationContentEntryComponent {
  data = input.required<ReservationDetails>()
  reloading = input.required()
  reload = output<boolean>()

  updating = signal(false)

  statusClass = computed(() => classes[this.data().reservation.status] || 'bg-gray-100 text-gray-800')
  verificationIcon = computed(() => {
    const status = this.data().visitor.verification.status;
    return status === VerificationStatus.CONFIRMED ? 'check_circle' :
      status === VerificationStatus.UNCONFIRMED ? 'schedule' :
        'error';
  })
  verificationIconClass = computed(() => {
    const status = this.data().visitor.verification.status;
    return status === VerificationStatus.CONFIRMED ? 'text-green-600' :
      status === VerificationStatus.UNCONFIRMED ? 'text-yellow-600' :
        'text-red-600';
  })
  visitorTypeIcon = computed(() => {
    const type = this.data().visitor.type;
    const icons: Record<VisitorType, string> = {
      GROUP: 'groups',
      SINGLE: 'person'
    };
    return icons[type] || 'person';
  });


  protected readonly VisitorType = VisitorType;

  constructor(
    private service: ReservationService,
    private visitorService: VisitorService,
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
      data: {info: this.data(), offerId: 0, confirmation: false},
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
