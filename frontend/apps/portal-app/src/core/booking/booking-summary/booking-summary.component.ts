import {Component, computed, input, output} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {DayInfoOffer, VisitorType} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {CreateBookingRequest} from "@open-booking/portal";
import {VisitorInfoComponent} from "../../visitor/visitor-info/visitor-info.component";

@Component({
  selector: 'app-booking-summary',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    TranslatePipe,
    DatePipe,
    VisitorInfoComponent
  ],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.scss',
})
export class BookingSummaryComponent {
  data = input.required<DayInfoOffer>()
  request = input.required<CreateBookingRequest>()

  start = computed(() => this.data().offer.start)
  finish = computed(() => this.data().offer.finish)
  maxPersons = computed(() => this.data().assignment.availableSpace)

  visitorGroup = computed(() => this.request().visitor)
  address = computed(() => this.visitorGroup().address.zip + " " + this.visitorGroup().address.city + " " + this.visitorGroup().address.street + " ")
  comment = computed(() => this.request().comment)
  termsAccepted = computed(() => this.request().termsAndConditions)
  isGroup = computed(() => this.visitorGroup().type === VisitorType.GROUP)

  confirm = output<CreateBookingRequest>()
  edit = output<CreateBookingRequest>()

}
