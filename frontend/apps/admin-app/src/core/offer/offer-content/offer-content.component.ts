import {Component, input, output, signal} from '@angular/core';
import {DaySummary, OfferSearchEntry, WeekSummary} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDialog} from "@angular/material/dialog";
import {
  OfferFeatureRedistributeDialogComponent
} from "../offer-feature-redistribute-dialog/offer-feature-redistribute-dialog.component";
import {ExportService, OfferService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {DashboardSummaryComponent} from "../../dashboard/dashboard-summary/dashboard-summary.component";
import {TranslatePipe} from "@ngx-translate/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {OfferContentEntryComponent} from "../offer-content-entry/offer-content-entry.component";

@Component({
  selector: 'app-offer-content',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    DashboardSummaryComponent,
    TranslatePipe,
    OfferContentEntryComponent,

  ],
  templateUrl: './offer-content.component.html',
  styleUrl: './offer-content.component.scss',
})
export class OfferContentComponent {
  selectedDay = input.required<string>()
  entries = input.required<OfferSearchEntry[]>()
  reloading = input<boolean>(false)
  currentUserId = input<string>('')
  isSearchActive = input<boolean>(false)


  edit = output<OfferSearchEntry>()
  delete = output<OfferSearchEntry>()
  reload = output<boolean>()
  toggleActive = output<OfferSearchEntry>()

  selectionWeekChanged = output<WeekSummary>()
  selectionDayChanged = output<DaySummary | undefined>()

  relabeling = signal(false)

  constructor(private service: OfferService, private exportService: ExportService, private dialog: MatDialog, private toast: HotToastService) {

  }


  protected handleRedistribute() {
    let dialogRef = this.dialog.open(OfferFeatureRedistributeDialogComponent, {data: this.selectedDay()})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.redistributeOffer(value).subscribe(() => this.reload.emit(true))
    })
  }

  protected handleRelable() {
    this.relabeling.set(true)
    this.service.relabelOffer(this.selectedDay()).subscribe(() => {
      this.relabeling.set(false)
      this.reload.emit(true)
    })
  }

  protected exportExcel() {
    let reference = this.toast.loading("Download started...")
    this.exportService.createDailyReportExcel(this.selectedDay())
      .subscribe({
          error: (e) => {
            reference.close()
            this.toast.error("Failed to generate Excel for " + this.selectedDay())
          },
          complete: () => reference.close()
        }
      )
  }
}
