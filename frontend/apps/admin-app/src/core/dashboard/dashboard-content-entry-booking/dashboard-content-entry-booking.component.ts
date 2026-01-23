import {Component, computed, input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {OfferBookingEntry} from "@open-booking/core";
import {MatDialog} from "@angular/material/dialog";
import {
  ReservationDetailsDialogComponent
} from "../../reservation/reservation-details-dialog/reservation-details-dialog.component";
import {BookingStatusComponent, VisitorTypeComponent} from "@open-booking/shared";
import {RouterLink} from "@angular/router";
import {VisitorSizeComponent} from "../../visitor/visitor-size/visitor-size.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-dashboard-content-entry-booking',
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    VisitorTypeComponent,
    RouterLink,
    BookingStatusComponent,
    VisitorSizeComponent,
    TranslatePipe,
  ],
  templateUrl: './dashboard-content-entry-booking.component.html',
  styleUrl: './dashboard-content-entry-booking.component.scss',
})
export class DashboardContentEntryBookingComponent {

  booking = input.required<OfferBookingEntry>()
  name = computed(() => this.booking().visitor.type == "GROUP" ? this.booking().visitor.title : this.booking().visitor.name)
  comment = computed(() => "")


  constructor(private dialog: MatDialog) {
  }


  protected showDetails() {
    this.dialog.open(ReservationDetailsDialogComponent, {
      disableClose: true,
      data: this.booking().bookingId,
      width: 'auto',
      maxWidth: 'none',
    })
  }
}
