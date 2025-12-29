import {Component, computed, input, output} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {CreateBookingRequest, DayInfoOffer} from "@open-booking/core";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-booking-summary',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.scss',
})
export class BookingSummaryComponent {
  spaceAvailable = input.required<number>()
  entries = input.required<DayInfoOffer[]>()
  preferredEntry = input.required<DayInfoOffer>()
  request = input.required<CreateBookingRequest>()

  visitorGroup = computed(() => this.request().visitorGroupChangeRequest)
  address = computed(() => this.visitorGroup().address.zip + " " + this.visitorGroup().address.city + " " + this.visitorGroup().address.street + " ")
  comment = computed(() => this.request().comment)
  termsAccepted = computed(() => this.request().termsAndConditions)

  confirm = output<CreateBookingRequest>()
  edit = output<CreateBookingRequest>()

  isPreferred(info: DayInfoOffer): boolean {
    return info.offer.id === this.preferredEntry().offer.id;
  }

}
