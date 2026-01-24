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
import {ExportService, OfferService} from "@open-booking/admin";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {TranslatePipe} from "@ngx-translate/core";
import {HotToastService} from "@ngxpert/hot-toast";

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
    TranslatePipe,
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

  constructor(private service: OfferService, private exportService: ExportService, private dialog: MatDialog, private toast: HotToastService) {

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

  protected exportExcel(entry: OfferGroupedSearchResult) {
    let reference = this.toast.loading("Download started...")
    this.exportService.createDailyReportExcel(entry.day)
      .subscribe({
          error: (e) => {
            reference.close()
            this.toast.error("Failed to generate Excel for " + entry.day)
          },
          complete: () => reference.close()
        }
      )
  }
}
