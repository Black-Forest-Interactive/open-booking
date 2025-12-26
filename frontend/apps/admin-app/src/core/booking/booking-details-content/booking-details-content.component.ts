import {Component, input} from '@angular/core';
import {BookingInfo, BookingRequestInfo} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {RequestService} from "@open-booking/admin";

@Component({
  selector: 'app-booking-details-content',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    DatePipe,
    TranslatePipe
  ],
  templateUrl: './booking-details-content.component.html',
  styleUrl: './booking-details-content.component.scss',
})
export class BookingDetailsContentComponent {
  data = input.required<BookingRequestInfo>()

  constructor(private service: RequestService) {
  }

  protected confirm(booking: BookingInfo) {
    // TODO
  }

  protected denial(booking: BookingInfo) {
    // TODO
  }
}
