import {Component, computed, input, signal} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {AddressPipe, OfferReservationEntry, ReservationStatus} from "@open-booking/core";
import {MatDialog} from "@angular/material/dialog";
import {
  ReservationDetailsDialogComponent
} from "../../reservation/reservation-details-dialog/reservation-details-dialog.component";

@Component({
  selector: 'app-dashboard-content-entry-reservation',
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    AddressPipe,
  ],
  templateUrl: './dashboard-content-entry-reservation.component.html',
  styleUrl: './dashboard-content-entry-reservation.component.scss',
})
export class DashboardContentEntryReservationComponent {

  reservation = input.required<OfferReservationEntry>()

  isExpanded = signal(false)
  isConfirmed = computed(() => this.reservation().status === ReservationStatus.CONFIRMED)
  comment = computed(() => "")
  emailSent = computed(() => false)
  emailDelivered = computed(() => false)


  constructor(private dialog: MatDialog) {
  }

  toggleExpand(): void {
    this.isExpanded.update(value => !value)
  }

  protected showDetails() {
    this.dialog.open(ReservationDetailsDialogComponent, {
      disableClose: true,
      data: this.reservation().reservationId,
      width: 'auto',
      maxWidth: 'none',
    })
  }
}
