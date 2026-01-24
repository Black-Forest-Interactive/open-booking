import {Component, computed, input, output, Signal} from '@angular/core';
import {DayInfo, DayInfoOffer} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BookingProcessService} from "../../booking/booking-process.service";
import {Router} from "@angular/router";
import {navigateToBooking} from "../../../app/app.navigation";
import {DayInfoDetailsListEntryComponent} from "../cart-info-details-list-entry/day-info-details-list-entry.component";
import {ClaimInfoComponent} from "../../claim/claim-info/claim-info.component";

@Component({
  selector: 'app-day-info-details-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    TranslatePipe,
    DayInfoDetailsListEntryComponent,
    ClaimInfoComponent
  ],
  templateUrl: './day-info-details-list.component.html',
  styleUrl: './day-info-details-list.component.scss',
})
export class DayInfoDetailsListComponent {
  data = input.required<DayInfo>()
  offers = computed(() => this.data().offer)
  maxGroupSize: Signal<number | undefined>
  selectedOffer: Signal<DayInfoOffer | undefined>

  refresh = output<boolean>()

  constructor(private service: BookingProcessService, private router: Router) {
    this.maxGroupSize = this.service.maxGroupSize
    this.selectedOffer = this.service.selectedOffer
  }

  protected proceedToBooking() {
    navigateToBooking(this.router)
  }

  protected reload() {
    this.refresh.emit(true)
  }
}
