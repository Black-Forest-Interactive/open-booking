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
  data = input.required<DayInfoOffer>()
  request = input.required<CreateReservationRequest>()

  start = computed(() => this.data().offer.start)
  finish = computed(() => this.data().offer.finish)
  maxPersons = computed(() => this.data().assignment.availableSpace)

  visitorGroup = computed(() => this.request().visitor)
  address = computed(() => this.visitorGroup().address.zip + " " + this.visitorGroup().address.city + " " + this.visitorGroup().address.street + " ")
  comment = computed(() => this.request().comment)
  termsAccepted = computed(() => this.request().termsAndConditions)
  isGroup = computed(() => this.visitorGroup().type === VisitorType.GROUP)

  confirm = output<CreateReservationRequest>()
  edit = output<CreateReservationRequest>()

}
