import {Component, computed, input} from '@angular/core';
import {DayInfoOffer} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";

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

  confirmedSpace = computed(() => this.data().assignment.confirmedSpace)
  pendingSpace = computed(() => this.data().assignment.pendingSpace)
  availableSpace = computed(() => this.data().assignment.availableSpace)

}
