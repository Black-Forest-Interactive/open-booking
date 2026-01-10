import {Component, computed, input, output} from '@angular/core';
import {DayInfoOffer} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {ReservationProcessService} from "../../reservation/reservation-process.service";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {DateTime} from "luxon";

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
  isUserClaimed = computed(() => this.data().offer.id === this.service.claimedOfferId())
  isClaimed = computed(() => (this.data().claimedUntil && !this.isUserClaimed()) ?? false)
  claimedUntil = computed(() => !this.isUserClaimed() ? this.transformClaimedUntil(this.data().claimedUntil) : "")

  reservedSpace = computed(() => this.data().assignment.reservedSpace)
  availableSpace = computed(() => this.data().assignment.availableSpace)
  hasAvailableSpace = computed(() => this.availableSpace() > 0)
  hasUnconfirmedBookings = computed(() => this.reservedSpace() > 0)

  refresh = output<boolean>()


  constructor(private service: ReservationProcessService) {
    this.service.updateClaim()
  }

  protected handleSelection() {
    if (this.isClaimed()) return
    if (this.isSelected()) {
      this.service.unselect().subscribe(value => this.refresh.emit(true))
    } else {
      this.service.select(this.data()).subscribe(value => this.refresh.emit(true))
    }
  }

  protected transformClaimedUntil(timestamp: string | undefined): string | null {
    if (!timestamp) return null
    try {
      return DateTime.fromISO(timestamp, {zone: 'utc'}).toISO()
    } catch {
      return null
    }
  }
}
