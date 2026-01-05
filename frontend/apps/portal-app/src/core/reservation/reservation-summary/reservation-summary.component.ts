import {Component, computed, input, output} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {DayInfoOffer, VisitorType} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {CreateReservationRequest} from "@open-booking/portal";

@Component({
  selector: 'app-reservation-summary',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './reservation-summary.component.html',
  styleUrl: './reservation-summary.component.scss',
})
export class ReservationSummaryComponent {
  spaceAvailable = input.required<number>()
  entries = input.required<DayInfoOffer[]>()
  preferredEntry = input.required<DayInfoOffer>()
  request = input.required<CreateReservationRequest>()

  visitorGroup = computed(() => this.request().visitor)
  address = computed(() => this.visitorGroup().address.zip + " " + this.visitorGroup().address.city + " " + this.visitorGroup().address.street + " ")
  comment = computed(() => this.request().comment)
  termsAccepted = computed(() => this.request().termsAndConditions)
  isGroup = computed(() => this.visitorGroup().type === VisitorType.GROUP)

  confirm = output<CreateReservationRequest>()
  edit = output<CreateReservationRequest>()

  isPreferred(info: DayInfoOffer): boolean {
    return info.offer.id === this.preferredEntry().offer.id;
  }

}
