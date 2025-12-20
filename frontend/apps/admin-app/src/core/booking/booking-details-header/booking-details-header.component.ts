import {Component, input} from '@angular/core';
import {BookingRequestInfo} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-booking-details-header',
  imports: [
    MatCardModule,
    TranslatePipe,
    DatePipe,
  ],
  templateUrl: './booking-details-header.component.html',
  styleUrl: './booking-details-header.component.scss',
})
export class BookingDetailsHeaderComponent {
  data = input.required<BookingRequestInfo>()
}
