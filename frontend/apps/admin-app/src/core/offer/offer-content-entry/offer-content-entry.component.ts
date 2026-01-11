import {Component, computed, input, output} from '@angular/core';
import {OfferSearchEntry} from "@open-booking/core";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DatePipe} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {OfferAssignmentComponent} from "../offer-assignment/offer-assignment.component";

@Component({
  selector: 'app-offer-content-entry',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSlideToggleModule,
    TranslatePipe,
    DatePipe,
    OfferAssignmentComponent
  ],
  templateUrl: './offer-content-entry.component.html',
  styleUrl: './offer-content-entry.component.scss',
})
export class OfferContentEntryComponent {
  entry = input.required<OfferSearchEntry>()
  reloading = input.required()

  edit = output<OfferSearchEntry>()
  delete = output<OfferSearchEntry>()
  toggleActive = output<OfferSearchEntry>()

  color = computed(() => this.entry().info.label?.color ?? '')
  label = computed(() => this.entry().info.label?.name ?? '')
  start = computed(() => this.entry().info.offer.start ?? '')
  finish = computed(() => this.entry().info.offer.finish ?? '')
  maxPersons = computed(() => this.entry().info.offer.maxPersons ?? '')
  active = computed(() => this.entry().info.offer.active ?? '')
  guide = computed(() => (this.entry().info.guide?.firstName ?? '') + ' ' + (this.entry().info.guide?.lastName ?? ''))
  assignment = computed(() => this.entry().assignment)
}
