import {Component, input, output} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {BookingDetails} from "@open-booking/core";
import {BookingDetailViewComponent} from "../booking-detail-view/booking-detail-view.component";

@Component({
  selector: 'app-booking-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BookingDetailViewComponent,
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent {

  data = input.required<BookingDetails>()
  showBackButton = input(false)
  reloading = input.required()

  reload = output<boolean>()
  close = output<boolean>()
  back = output<boolean>()


}
