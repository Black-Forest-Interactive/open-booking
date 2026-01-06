import {ChangeDetectionStrategy, Component, computed, resource, signal} from '@angular/core';
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {OfferService} from "@open-booking/admin";
import {MatDialog} from "@angular/material/dialog";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {OfferSearchEntry, OfferSearchRequest} from "@open-booking/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatChipsModule} from "@angular/material/chips";
import {DateTime} from "luxon";
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

@Component({
  selector: 'app-offer',
  imports: [
    CommonModule,
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
    MatProgressSpinner
  ],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent {

  private fullTextSearch = signal('')
  private dateFrom = signal<string | null | undefined>(null)
  private dateTo = signal<string | null | undefined>(null)

  range = new FormGroup({
    start: new FormControl<DateTime | null>(null, Validators.required),
    end: new FormControl<DateTime | null>(null, Validators.required),
  })

  pageNumber = signal(0)
  pageSize = signal(25)

  private offerCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: new OfferSearchRequest(this.fullTextSearch(), this.dateFrom(), this.dateTo())
  }))

  private offerResource = resource({
    params: this.offerCriteria,
    loader: (param) => toPromise(this.service.searchOfferGroupedByDay(param.params.request), param.abortSignal)
  })

  offer = computed(() => this.offerResource.value() ?? [])
  reloading = this.offerResource.isLoading


  constructor(
    private service: OfferService,
    private dialog: MatDialog
  ) {
    this.range.valueChanges.subscribe(d => this.handleSelectionChange())
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  protected clearSelection() {
    this.range.get('start')?.setValue(null)
    this.range.get('end')?.setValue(null)
    this.range.reset()
    this.applyFilter()
  }

  protected applyFilter() {
    let filter = this.range.value
    this.dateFrom.set(filter.start?.toISO({includeOffset: false}))
    this.dateTo.set(filter.end?.toISO({includeOffset: false}))
  }

  protected handleSelectionChange() {
    let start = this.range.get('start')?.value
    let end = this.range.get('end')?.value
    if (this.range.invalid) return
    if (start != null && end != null) {
      this.pageNumber.set(0)
      this.applyFilter()
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

  protected handleCreateSeries() {
    this.dialog.open(OfferFeatureCreateSeriesDialogComponent, {
      disableClose: true,
    })
  }

  protected handleCreateRange() {
    this.dialog.open(OfferFeatureCreateRangeDialogComponent, {
      disableClose: true,
    })
  }

  protected reload() {
    this.offerResource.reload()
  }
}
