import {Component, computed, input} from '@angular/core';
import {DayInfo, DayInfoHelper, DayInfoOffer} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {WorkflowService} from "../../workflow.service";
import {Router} from "@angular/router";
import {navigateToBooking} from "../../../app/app.navigation";

@Component({
  selector: 'app-day-info-details-list',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './day-info-details-list.component.html',
  styleUrl: './day-info-details-list.component.scss',
})
export class DayInfoDetailsListComponent {
  data = input.required<DayInfo>()

  offers = computed(() => this.data().offer)

  protected translationParam(offer: DayInfoOffer) {
    return {value: DayInfoHelper.getSpaceAvailable(offer)}
  }

  constructor(private service: WorkflowService, private router: Router) {
  }

  isSelected(offer: any) {
    return this.service.entries().has(offer)
  }

  selectedCount() {
    return this.service.entries().size
  }

  handleSelection(offer: DayInfoOffer) {
    this.service.selectOffer(offer)
  }

  maxGroupSize() {
    return this.service.maxGroupSize()
  }

  protected proceedToBooking() {
    navigateToBooking(this.router)
  }
}
