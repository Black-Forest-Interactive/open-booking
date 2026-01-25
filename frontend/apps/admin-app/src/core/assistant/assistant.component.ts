import {Component, signal} from '@angular/core';
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {TranslatePipe} from "@ngx-translate/core";
import {OfferFinderComponent} from "./offer-finder/offer-finder.component";
import {BookingCreateComponent} from "../booking/booking-create/booking-create.component";
import {OfferReference} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-assistant',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MainContentComponent,
    TranslatePipe,
    OfferFinderComponent,
    BookingCreateComponent
  ],
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.scss',
})
export class AssistantComponent {

  selectedOffer = signal<OfferReference | undefined>(undefined)

  protected handleOfferSelected(offer: OfferReference | undefined) {
    this.selectedOffer.set(offer)
  }
}
