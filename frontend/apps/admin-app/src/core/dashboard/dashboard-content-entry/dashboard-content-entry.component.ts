import {Component, computed, input} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {OfferSearchEntry} from "@open-booking/core";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingListEntryComponent} from "../../booking/booking-list-entry/booking-list-entry.component";

@Component({
  selector: 'app-dashboard-content-entry',
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    DatePipe,
    TranslatePipe,
    BookingListEntryComponent
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
