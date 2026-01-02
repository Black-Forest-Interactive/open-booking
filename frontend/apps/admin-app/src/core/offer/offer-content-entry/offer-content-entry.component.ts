import {Component, computed, input, output} from '@angular/core';
import {OfferInfo} from "@open-booking/core";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DatePipe} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-offer-content-entry',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './offer-content-entry.component.html',
  styleUrl: './offer-content-entry.component.scss',
})
export class OfferContentEntryComponent {
  info = input.required<OfferInfo>()
  reloading = input.required()

  edit = output<OfferInfo>()
  delete = output<OfferInfo>()


  color = computed(() => this.info().label?.color ?? '')
  label = computed(() => this.info().label?.name ?? '')
  start = computed(() => this.info().offer.start ?? '')
  finish = computed(() => this.info().offer.finish ?? '')
  maxPersons = computed(() => this.info().offer.maxPersons ?? '')
  active = computed(() => this.info().offer.active ?? '')
  guide = computed(() => (this.info().guide?.firstName ?? '') + ' ' + (this.info().guide?.lastName ?? ''))
}
