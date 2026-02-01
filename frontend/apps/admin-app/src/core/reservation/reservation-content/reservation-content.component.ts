import {Component, computed, input, output} from '@angular/core';
import {BookingDetails} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {VisitorTitleComponent} from "../../visitor/visitor-title/visitor-title.component";
import {VisitorSizeComponent} from "../../visitor/visitor-size/visitor-size.component";
import {EditorInfoComponent} from "../../editor/editor-info/editor-info.component";
import {BookingStatusComponent, VerificationStatusComponent, VisitorTypeComponent} from "@open-booking/shared";
import {ReservationEditButtonComponent} from "../reservation-edit-button/reservation-edit-button.component";
import {groupBookingDetailsByDate} from "@open-booking/admin";
import {OfferBookingCapacityComponent} from "../../offer/offer-booking-capacity/offer-booking-capacity.component";


@Component({
  selector: 'app-reservation-content',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    DatePipe,
    VisitorTitleComponent,
    VisitorSizeComponent,
    EditorInfoComponent,
    VisitorTypeComponent,
    VerificationStatusComponent,
    BookingStatusComponent,
    ReservationEditButtonComponent,
    OfferBookingCapacityComponent
  ],
  templateUrl: './reservation-content.component.html',
  styleUrl: './reservation-content.component.scss',
})
export class ReservationContentComponent {
  entries = input.required<BookingDetails[]>()
  reloading = input<boolean>(false)
  currentUserId = input<string>('')

  reload = output<number>()

  groupedEntries = computed(() => groupBookingDetailsByDate(this.entries()))

  getTimestamp(entry: BookingDetails): string {
    return entry.timestamp + 'Z'
  }

}
