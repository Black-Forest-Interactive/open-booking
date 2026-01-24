import {Component, input, output} from '@angular/core';
import {BookingStatusComponent, VerificationStatusComponent, VisitorTypeComponent} from "@open-booking/shared";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {BookingDetails} from "@open-booking/core";
import {VisitorTitleComponent} from "../../visitor/visitor-title/visitor-title.component";
import {VisitorSizeComponent} from "../../visitor/visitor-size/visitor-size.component";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDivider} from "@angular/material/list";
import {DatePipe} from "@angular/common";
import {OfferReferenceComponent} from "../../offer/offer-reference/offer-reference.component";

@Component({
  selector: 'app-booking-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BookingStatusComponent,
    VerificationStatusComponent,
    VisitorTypeComponent,
    VisitorTitleComponent,
    VisitorSizeComponent,
    TranslatePipe,
    MatDivider,
    DatePipe,
    OfferReferenceComponent,
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


  constructor() {
  }

}
