import {Component, computed, input} from '@angular/core';
import {DayInfo} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ReservationProcessService} from "../../reservation/reservation-process.service";
import {Router} from "@angular/router";
import {navigateToReservation} from "../../../app/app.navigation";
import {DayInfoDetailsListEntryComponent} from "../cart-info-details-list-entry/day-info-details-list-entry.component";

@Component({
  selector: 'app-day-info-details-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    TranslatePipe,
    DayInfoDetailsListEntryComponent
  ],
  templateUrl: './day-info-details-list.component.html',
  styleUrl: './day-info-details-list.component.scss',
})
export class DayInfoDetailsListComponent {
  data = input.required<DayInfo>()

  offers = computed(() => this.data().offer)
  selectedCount = computed(() => this.service.entries().length)
  maxGroupSize = computed(() => this.service.maxGroupSize())

  constructor(private service: ReservationProcessService, private router: Router) {
  }

  protected proceedToBooking() {
    navigateToReservation(this.router)
  }

}
