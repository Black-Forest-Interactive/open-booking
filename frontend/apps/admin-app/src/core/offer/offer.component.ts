import {ChangeDetectionStrategy, Component, computed, resource, signal} from '@angular/core';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

import {TranslatePipe} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {OfferService} from "@open-booking/admin";
import {MatDialog} from "@angular/material/dialog";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {DaySummary, OfferSearchEntry, OfferSearchRequest, WeekSummary} from "@open-booking/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatChipsModule} from "@angular/material/chips";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {OfferDeleteDialogComponent} from "./offer-delete-dialog/offer-delete-dialog.component";
import {OfferContentComponent} from "./offer-content/offer-content.component";
import {OfferEditDialogComponent} from "./offer-edit-dialog/offer-edit-dialog.component";
import {
  OfferFeatureCreateSeriesDialogComponent
} from "./offer-feature-create-series-dialog/offer-feature-create-series-dialog.component";
import {
  OfferFeatureCreateRangeDialogComponent
} from "./offer-feature-create-range-dialog/offer-feature-create-range-dialog.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {
  OfferFeatureCreateSingleDialogComponent
} from "./offer-feature-create-single-dialog/offer-feature-create-single-dialog.component";
import {DateTime} from "luxon";
import {
  OfferFeatureChangeDurationDialogComponent
} from "./offer-feature-change-duration-dialog/offer-feature-change-duration-dialog.component";

@Component({
  selector: 'app-offer',
  imports: [
    ReactiveFormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatChipsModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    RouterLink,
    TranslatePipe,
    LoadingBarComponent,
    OfferContentComponent,
    MatProgressSpinner,
    MainContentComponent
  ],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent {

  selectedDay = signal('')
  dateFrom = signal<string | null | undefined>(null)
  dateTo = signal<string | null | undefined>(null)

  request = computed(() => new OfferSearchRequest('', this.dateFrom(), this.dateTo()))

  private offerCriteria = computed(() => ({
    request: this.request()
  }))


  private offerResource = resource({
    params: this.offerCriteria,
    loader: param => toPromise(this.service.searchOfferGroupedByDay(param.params.request), param.abortSignal)
  })

  private response = computed(() => this.offerResource.value() ?? [])
  private selectedGroup = computed(() => this.response().find(g => g.day === this.selectedDay()) ?? this.response()[0])
  entries = computed(() => this.selectedGroup()?.entries ?? [])
  reloading = this.offerResource.isLoading


  constructor(
    private service: OfferService,
    private dialog: MatDialog
  ) {
  }

  protected reload() {
    this.offerResource.reload()
  }

  protected handleSelectionWeekChanged(event: WeekSummary) {
    let start = DateTime.fromISO(event.startDate, {zone: 'utc'}).startOf('day')
    let end = DateTime.fromISO(event.endDate, {zone: 'utc'}).endOf('day')
    this.dateFrom.set(start.toISO({includeOffset: false}))
    this.dateTo.set(end.toISO({includeOffset: false}))
  }

  protected handleSelectionDayChanged(event: DaySummary | undefined) {
    if (event) {
      let start = DateTime.fromISO(event.date, {zone: 'utc'}).startOf('day')
      let end = DateTime.fromISO(event.date, {zone: 'utc'}).endOf('day')

      this.dateFrom.set(start.toISO({includeOffset: false}))
      this.dateTo.set(end.toISO({includeOffset: false}))
      this.selectedDay.set(event.date)
    }
  }


  protected handleEdit(entry: OfferSearchEntry) {
    let dialogRef = this.dialog.open(OfferEditDialogComponent, {data: entry, disableClose: true})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.updateOffer(entry.info.offer.id, value).subscribe(() => this.offerResource.reload())
    })
  }

  protected handleDelete(entry: OfferSearchEntry) {
    let dialogRef = this.dialog.open(OfferDeleteDialogComponent, {data: entry.info.offer})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.deleteOffer(entry.info.offer.id).subscribe(() => this.offerResource.reload())
    })
  }

  protected handleCreateSingle() {
    this.dialog.open(OfferFeatureCreateSingleDialogComponent, {
      disableClose: true,
    }).afterClosed().subscribe(value => this.reload())
  }

  protected handleCreateSeries() {
    this.dialog.open(OfferFeatureCreateSeriesDialogComponent, {
      disableClose: true,
    }).afterClosed().subscribe(value => this.reload())
  }

  protected handleCreateRange() {
    this.dialog.open(OfferFeatureCreateRangeDialogComponent, {
      disableClose: true,
    }).afterClosed().subscribe(value => this.reload())
  }

  protected handleChangeDuration() {
    this.dialog.open(OfferFeatureChangeDurationDialogComponent, {
      disableClose: true,
    }).afterClosed().subscribe(value => this.reload())
  }

  protected handleToggleActive(entry: OfferSearchEntry) {
    this.service.setOfferActive(entry.info.offer.id, !entry.info.offer.active).subscribe(value => this.offerResource.reload())
  }


}
