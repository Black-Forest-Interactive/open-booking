import {Component, computed, input, output, signal} from '@angular/core';
import {OfferGroupedSearchResult, OfferSearchEntry} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {DatePipe, NgClass} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {OfferContentEntryComponent} from "../offer-content-entry/offer-content-entry.component";
import {MatDialog} from "@angular/material/dialog";
import {
  OfferFeatureRedistributeDialogComponent
} from "../offer-feature-redistribute-dialog/offer-feature-redistribute-dialog.component";
import {OfferService} from "@open-booking/admin";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-offer-content',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    DatePipe,
    OfferContentEntryComponent,
    NgClass,
    MatProgressSpinner,
  ],
  templateUrl: './offer-content.component.html',
  styleUrl: './offer-content.component.scss',
})
export class OfferContentComponent {
  reloading = input(false)
  entries = input.required<OfferGroupedSearchResult[]>()

  edit = output<OfferSearchEntry>()
  delete = output<OfferSearchEntry>()
  reload = output<boolean>()
  toggleActive = output<OfferSearchEntry>()

  relabeling = signal(false)

  selectedDay = signal<string>('')
  selectedEntry = computed(() => this.entries().find(e => e.day === this.selectedDay()) ?? this.entries()[0])

  constructor(private service: OfferService, private dialog: MatDialog) {

  }

  protected handleRedistribute(entry: OfferGroupedSearchResult) {
    let dialogRef = this.dialog.open(OfferFeatureRedistributeDialogComponent, {data: entry.day})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.redistributeOffer(value).subscribe(() => this.reload.emit(true))
    })
  }

  protected handleRelable(entry: OfferGroupedSearchResult) {
    this.relabeling.set(true)
    this.service.relabelOffer(entry.day).subscribe(() => {
      this.relabeling.set(false)
      this.reload.emit(true)
    })
  }
}
