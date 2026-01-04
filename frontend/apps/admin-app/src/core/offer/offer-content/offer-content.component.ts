import {Component, computed, input, output} from '@angular/core';
import {OfferSearchEntry} from "@open-booking/core";
import {DateTime} from "luxon";
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
  entries = input.required<OfferSearchEntry[]>()


  edit = output<OfferSearchEntry>()
  delete = output<OfferSearchEntry>()


  offersGroupedByDay = computed(() => {
    return this.entries().reduce<Record<string, OfferSearchEntry[]>>(
      (acc, offerInfo) => {
        const dayKey = DateTime
          .fromISO(offerInfo.info.offer.start)
          .toISODate()

        if (!dayKey) {
          return acc;
        }

        acc[dayKey] ??= []
        acc[dayKey].push(offerInfo)

        return acc
      },
      {}
    )
  })

  dayKeys = computed(() =>
    Object.keys(this.offersGroupedByDay()).sort(
      (a, b) =>
        DateTime.fromISO(a).toMillis() -
        DateTime.fromISO(b).toMillis()
    )
  )

  getOffersForDay(day: string): OfferSearchEntry[] {
    return this.offersGroupedByDay()[day] ?? []
  }

}
