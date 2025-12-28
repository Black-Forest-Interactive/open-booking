import {Component, computed, input} from '@angular/core';
import {DayInfoOffer} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {WorkflowService} from "../../workflow.service";
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

  isSelected = computed(() => !!this.service.entries().find(o => o.offer.id === this.data().offer.id))
  confirmedSpace = computed(() => this.data().space.CONFIRMED || 0)
  unconfirmedSpace = computed(() => this.data().space.UNCONFIRMED || 0)
  availableSpace = computed(() => this.data().offer.maxPersons - this.confirmedSpace() - this.unconfirmedSpace())
  hasAvailableSpace = computed(() => this.availableSpace() > 0)
  hasUnconfirmedBookings = computed(() => this.unconfirmedSpace() > 0)

  constructor(private service: WorkflowService) {
  }

  protected handleSelection() {
    if (this.isSelected()) {
      this.service.offerRemove(this.data())
    } else {
      this.service.offerAdd(this.data())
    }
  }
}
