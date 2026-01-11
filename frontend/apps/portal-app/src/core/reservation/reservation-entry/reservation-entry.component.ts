import {Component, computed, input} from '@angular/core';
import {DayInfoOffer} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {ReservationProcessService} from "../reservation-process.service";

@Component({
  selector: 'app-reservation-entry',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './reservation-entry.component.html',
  styleUrl: './reservation-entry.component.scss',
})
export class ReservationEntryComponent {
  data = input.required<DayInfoOffer>()


  confirmedSpace = computed(() => this.data().assignment.bookedSpace)
  unconfirmedSpace = computed(() => this.data().assignment.reservedSpace)
  availableSpace = computed(() => this.data().assignment.availableSpace)

  constructor(private service: ReservationProcessService) {
  }


}
