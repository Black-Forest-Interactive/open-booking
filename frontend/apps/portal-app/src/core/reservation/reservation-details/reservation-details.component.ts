import {Component, computed, input, resource} from '@angular/core';
import {ReservationService} from "@open-booking/portal";
import {
  LoadingBarComponent,
  ReservationStatusComponent,
  toPromise,
  VerificationStatusComponent,
  VisitorTypeComponent
} from "@open-booking/shared";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {ReservationStatus, VisitorType} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {VisitorInfoComponent} from "../../visitor/visitor-info/visitor-info.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-reservation-details',
  imports: [
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    LoadingBarComponent,
    ReservationStatusComponent,
    DatePipe,
    VisitorInfoComponent,
    TranslatePipe,
    VerificationStatusComponent,
    VisitorTypeComponent
  ],
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.scss',
})
export class ReservationDetailsComponent {
  key = input<string>()

  private reservationResource = resource({
    params: this.key,
    loader: param => toPromise(this.service.getReservation(param.params), param.abortSignal)
  })

  reloading = this.reservationResource.isLoading
  error = this.reservationResource.error
  data = computed(() => this.reservationResource.value())
  isEditable = computed(() => this.data()?.status === ReservationStatus.UNCONFIRMED)

  status = computed(() => this.data()?.status ?? ReservationStatus.UNCONFIRMED)
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


  constructor(private service: ReservationService) {
  }

  getStatusClass(status: ReservationStatus): string {
    const classes: Record<ReservationStatus, string> = {
      [ReservationStatus.UNCONFIRMED]: 'bg-yellow-100 text-yellow-800',
      [ReservationStatus.CONFIRMED]: 'bg-green-100 text-green-800',
      [ReservationStatus.DENIED]: 'bg-gray-100 text-gray-800',
      [ReservationStatus.UNKNOWN]: 'bg-gray-100 text-gray-800',
      [ReservationStatus.EXPIRED]: 'bg-red-100 text-red-800'
    };
    return classes[status] || '';
  }
}
