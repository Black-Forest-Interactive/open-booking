import {Component, computed, input, resource} from '@angular/core';
import {BookingService} from "@open-booking/portal";
import {
  BookingStatusComponent,
  LoadingBarComponent,
  toPromise,
  VerificationStatusComponent,
  VisitorTypeComponent
} from "@open-booking/shared";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {BookingStatus, VisitorType} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {VisitorInfoComponent} from "../../visitor/visitor-info/visitor-info.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-booking-details',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    LoadingBarComponent,
    DatePipe,
    VisitorInfoComponent,
    TranslatePipe,
    VerificationStatusComponent,
    VisitorTypeComponent,
    BookingStatusComponent
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent {
  key = input<string>()

  private bookingResource = resource({
    params: this.key,
    loader: param => toPromise(this.service.getBooking(param.params), param.abortSignal)
  })

  reloading = this.bookingResource.isLoading
  error = this.bookingResource.error
  data = computed(() => this.bookingResource.value())
  isEditable = computed(() => this.data()?.status === BookingStatus.PENDING)

  status = computed(() => this.data()?.status ?? BookingStatus.PENDING)
  comment = computed(() => this.data()?.comment ?? '')
  timestamp = computed(() => this.data()?.timestamp ?? '')

  visitor = computed(() => this.data()?.visitor)
  verification = computed(() => this.visitor()?.verification)
  offer = computed(() => this.data()?.offer)
  start = computed(() => this.offer()?.start ?? '')
  finish = computed(() => this.offer()?.finish ?? '')
  maxPersons = computed(() => this.offer()?.maxPersons ?? 0)

  type = computed(() => this.data()?.visitor.type ?? VisitorType.SINGLE)
  size = computed(() => this.data()?.visitor.size ?? 0)
  title = computed(() => this.data()?.visitor.title ?? '')
  name = computed(() => this.data()?.visitor.name ?? '')
  email = computed(() => this.data()?.visitor.email ?? '')
  phone = computed(() => this.data()?.visitor.phone ?? '')
  minAge = computed(() => this.data()?.visitor.minAge ?? 0)
  maxAge = computed(() => this.data()?.visitor.maxAge ?? 0)
  description = computed(() => this.data()?.visitor.description ?? '')
  zip = computed(() => this.data()?.visitor.address.zip ?? '')
  city = computed(() => this.data()?.visitor.address.city ?? '')


  constructor(private service: BookingService) {
  }

}
