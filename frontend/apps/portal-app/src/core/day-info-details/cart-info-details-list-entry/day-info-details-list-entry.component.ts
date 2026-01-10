import {Component, computed, input} from '@angular/core';
import {DayInfoOffer} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ReservationProcessService} from "../../reservation/reservation-process.service";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-day-info-details-list-entry',
  imports: [
    MatCardModule,
    MatIconModule,
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './day-info-details-list-entry.component.html',
  styleUrl: './day-info-details-list-entry.component.scss',
})
export class DayInfoDetailsListEntryComponent {
  data = input.required<DayInfoOffer>()

  isSelected = computed(() => this.service.selectedOffer()?.offer?.id === this.data().offer.id)
  reservedSpace = computed(() => this.data().assignment.reservedSpace)
  availableSpace = computed(() => this.data().assignment.availableSpace)
  hasAvailableSpace = computed(() => this.availableSpace() > 0)
  hasUnconfirmedBookings = computed(() => this.reservedSpace() > 0)


  constructor(private service: ReservationProcessService) {
  }

  protected handleSelection() {
    if (this.isSelected()) {
      this.service.unselect()
    } else {
      this.service.select(this.data())
    }
  }
}
