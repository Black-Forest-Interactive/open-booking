import {ChangeDetectionStrategy, Component, computed, resource, signal} from '@angular/core';
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ExportService, OfferService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {MatDialog} from "@angular/material/dialog";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {OfferFilterRequest, OfferInfo} from "@open-booking/core";
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
    OfferContentComponent
  ],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent {

  range = new FormGroup({
    start: new FormControl<DateTime | null>(null, Validators.required),
    end: new FormControl<DateTime | null>(null, Validators.required),
  })

  pageNumber = signal(0)
  pageSize = signal(25)
  request = signal<OfferFilterRequest | undefined>(undefined)

  private offerCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    request: this.request()
  }))

  private offerResource = resource({
    params: this.offerCriteria,
    loader: (param) => {
      if (param.params.request) {
        return toPromise(this.service.filterInfo(param.params.request, param.params.page, param.params.size), param.abortSignal)
      } else {
        return toPromise(this.service.getAllOfferInfo(param.params.page, param.params.size), param.abortSignal)
      }
    }
  })

  private page = computed(() => this.offerResource.value())
  offer = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.offerResource.isLoading


  constructor(
    private service: OfferService,
    private exportService: ExportService,
    private toastService: HotToastService,
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
    if (filter.start || filter.end) {
      const start = filter.start?.toISODate()
      const end = filter.end?.toISODate()
      this.request.set(new OfferFilterRequest(start, end, null))
    } else {
      this.request.set(undefined)
    }
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

  protected handleEdit(info: OfferInfo) {
    let dialogRef = this.dialog.open(OfferEditDialogComponent, {data: info, disableClose: true})

    dialogRef.afterClosed().subscribe((value) => {
      debugger
      if (value) this.service.updateOffer(info.offer.id, value).subscribe(() => this.offerResource.reload())
    })
  }

  protected handleDelete(info: OfferInfo) {
    let dialogRef = this.dialog.open(OfferDeleteDialogComponent, {data: info.offer})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.deleteOffer(info.offer.id).subscribe(() => this.offerResource.reload())
    })
  }
}
