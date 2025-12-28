import {Component, computed, input} from '@angular/core';
import {DayInfoOffer} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {WorkflowService} from "../../workflow.service";

@Component({
  selector: 'app-booking-entry',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './booking-entry.component.html',
  styleUrl: './booking-entry.component.scss',
})
export class BookingEntryComponent {
  data = input.required<DayInfoOffer>()


  confirmedSpace = computed(() => this.data().space.CONFIRMED || 0)
  unconfirmedSpace = computed(() => this.data().space.UNCONFIRMED || 0)
  availableSpace = computed(() => this.data().offer.maxPersons - this.confirmedSpace() - this.unconfirmedSpace())
  isPreferred = computed(() => this.service.preferredEntry()?.offer?.id === this.data().offer.id)

  constructor(private service: WorkflowService) {
  }

  protected setPreferred() {
    this.service.setPreferred(this.data())
  }

  protected removeFromCart() {
    this.service.offerRemove(this.data())
  }
}
