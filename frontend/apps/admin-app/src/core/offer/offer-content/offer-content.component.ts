import {Component, input, output} from '@angular/core';
import {OfferGroupedSearchResult, OfferSearchEntry} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {OfferContentEntryComponent} from "../offer-content-entry/offer-content-entry.component";

@Component({
  selector: 'app-offer-content',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    DatePipe,
    OfferContentEntryComponent,
  ],
  templateUrl: './offer-content.component.html',
  styleUrl: './offer-content.component.scss',
})
export class OfferContentComponent {
  reloading = input(false)
  entries = input.required<OfferGroupedSearchResult[]>()

  edit = output<OfferSearchEntry>()
  delete = output<OfferSearchEntry>()

}
