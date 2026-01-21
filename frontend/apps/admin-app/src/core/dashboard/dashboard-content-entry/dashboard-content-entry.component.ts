import {Component, computed, input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {OfferSearchEntry} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {
  DashboardContentEntryBookingComponent
} from "../dashboard-content-entry-booking/dashboard-content-entry-booking.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-dashboard-content-entry',
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    DatePipe,
    DashboardContentEntryBookingComponent,
    TranslatePipe
  ],
  templateUrl: './dashboard-content-entry.component.html',
  styleUrl: './dashboard-content-entry.component.scss',
})
export class DashboardContentEntryComponent {
  data = input.required<OfferSearchEntry>()

  availableSpace = computed(() => this.data().assignment.availableSpace)
  bookedSpace = computed(() => this.data().assignment.confirmedSpace)
  reservedSpace = computed(() => this.data().assignment.pendingSpace)

  bookings = computed(() => this.data().bookings ?? [])

}
