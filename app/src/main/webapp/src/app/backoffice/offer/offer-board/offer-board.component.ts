import {Component, EventEmitter} from '@angular/core';
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Page} from "../../../shared/page/page";
import {PageEvent} from "@angular/material/paginator";
import {Offer, OfferFilterRequest} from "../model/offer-api";
import {OfferDeleteDialogComponent} from "../offer-delete-dialog/offer-delete-dialog.component";
import {OfferService} from "../model/offer.service";
import {ExportService} from "../../export/model/export.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
  selector: 'app-offer-board',
  templateUrl: './offer-board.component.html',
  styleUrls: ['./offer-board.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
})
export class OfferBoardComponent {

  reloading: boolean = false
  pageNumber = 0
  pageSize = 50
  totalElements = 0

  data: Offer[] = []

  displayedColumns: string[] = ['start', 'finish', 'maxPersons', 'active', 'cmd']

  keyUp: EventEmitter<string> = new EventEmitter<string>()

  range = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
  });


  constructor(
    private service: OfferService,
    private toastService: HotToastService,
    private translateService: TranslateService,
    private exportService: ExportService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.loadPage(this.pageNumber)

    this.keyUp.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(data => this.search(data))

    this.range.valueChanges.subscribe(d => this.handleSelectionChange())
  }

  private loadPage(number: number) {
    if (this.reloading) return
    this.reloading = true

    let filter = this.range.value
    if (filter.start || filter.end) {
      let start = this.convert(filter.start)
      let end = this.convert(filter.end)
      let request = new OfferFilterRequest(start, end, null)
      this.service.filter(request, number, this.pageSize).subscribe(p => this.handleData(p))
    } else {
      this.service.getAllOffer(number, this.pageSize).subscribe(p => this.handleData(p))
    }
  }

  private convert(date: Date | null | undefined): string | null {
    if (date == null) return null
    return date.toISOString()
  }

  private handleData(p: Page<Offer>) {
    this.data = p.content

    this.totalElements = p.totalSize
    this.pageNumber = p.pageable.number
    this.pageSize = p.pageable.size
    this.reloading = false
  }


  delete(offer: Offer) {
    let dialogRef = this.dialog.open(OfferDeleteDialogComponent, {data: offer})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.deleteOffer(offer.id).subscribe(() => this.handleDeleted(offer))
    });
  }

  private handleDeleted(offer: Offer) {
    this.translateService.get("OFFER.Message.DeleteSuccess", offer).subscribe(msg => this.toastService.success(msg))
    this.loadPage(0)
  }


  search(query: string) {
    this.toastService.error("Not implemented yet to search for '" + query + "'")
  }

  handlePageChange(event: PageEvent) {
    if (this.reloading) return
    this.pageSize = event.pageSize
    this.loadPage(event.pageIndex)
  }

  updateOfferOngoing: UpdateEntry[] = [];

  isUpdateOngoing(offer: Offer): boolean {
    return this.getUpdateEntry(offer) != null
  }

  private getUpdateEntry(offer: Offer): UpdateEntry | undefined {
    return this.updateOfferOngoing.find(o => o.offer.id == offer.id)
  }

  getOfferMode(offer: Offer) {
    return this.getUpdateEntry(offer)?.field ?? "none"
  }

  toggleActive(offer: Offer) {
    if (this.isUpdateOngoing(offer)) return

    this.updateOfferOngoing.push({offer: offer, field: 'active'});
    this.service.setOfferActive(offer.id, !offer.active).subscribe(data => this.updateOffer(data))
  }

  private updateOffer(offer: Offer) {
    const index = this.data.findIndex(u => u.id == offer.id)
    if (index >= 0) {
      this.data[index] = offer;
      this.data = [...this.data];
    }
    this.clearUpdateOffer(offer);
  }

  private clearUpdateOffer(offer: Offer) {
    const index = this.updateOfferOngoing.findIndex(u => u.offer.id == offer.id)
    if (index > -1) {
      this.updateOfferOngoing.splice(index, 1);
    }
  }


  clearSelection() {
    this.range.get('start')?.setValue(null)
    this.range.get('end')?.setValue(null)
    this.range.reset()
    this.applyFilter()
  }

  applyFilter() {
    this.loadPage(this.pageNumber)
  }

  handleSelectionChange() {
    let start = this.range.get('start')?.value
    let end = this.range.get('end')?.value
    if (this.range.invalid) return
    if (start != null && end != null) {
      this.loadPage(0)
    }
  }
}

interface UpdateEntry {
  offer: Offer,
  field: string
}
