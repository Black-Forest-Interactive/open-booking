import {Component, computed, output, resource, signal} from '@angular/core';
import {Assignment, OfferFindSuitableRequest, OfferReference} from "@open-booking/core";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {OfferService} from "@open-booking/admin";
import {DatePipe} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {OfferAssignmentComponent} from "../../offer/offer-assignment/offer-assignment.component";
import {TranslatePipe} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {DateTime} from "luxon";

interface DaySummary {
  day: string
  totalOffers: number
  activeOffers: number
  assignment: Assignment
}

@Component({
  selector: 'app-offer-finder',
  imports: [
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    OfferAssignmentComponent,
    LoadingBarComponent,
    TranslatePipe,
    DatePipe,
  ],
  templateUrl: './offer-finder.component.html',
  styleUrl: './offer-finder.component.scss',
})
export class OfferFinderComponent {

  offerSelected = output<OfferReference>()

  private dateFrom = signal<string | null | undefined>(null)
  private dateTo = signal<string | null | undefined>(null)

  range = new FormGroup({
    start: new FormControl<DateTime | null>(null, Validators.required),
    end: new FormControl<DateTime | null>(null, Validators.required),
  })

  visitorSize = signal(1)
  selectedDay = signal<string | null>(null)
  selectedOfferId = signal<number | null>(null)

  // Compute day summaries
  daySummaries = computed<DaySummary[]>(() => {
    return this.entries().map(dayGroup => ({
      day: dayGroup.day,
      totalOffers: dayGroup.entries.length,
      activeOffers: dayGroup.entries.filter(e => e.offer.active).length,
      assignment: {
        availableSpace: dayGroup.entries.reduce((sum, e) => sum + e.assignment.availableSpace, 0),
        pendingSpace: dayGroup.entries.reduce((sum, e) => sum + e.assignment.pendingSpace, 0),
        confirmedSpace: dayGroup.entries.reduce((sum, e) => sum + e.assignment.confirmedSpace, 0),
        deactivatedSpace: dayGroup.entries.reduce((sum, e) => sum + e.assignment.deactivatedSpace, 0),
      }
    }))
  })

  // Get offers for selected day
  selectedDayOffers = computed<OfferReference[]>(() => {
    const day = this.selectedDay();
    if (!day) return [];
    const dayGroup = this.entries().find(d => d.day === day)
    return dayGroup?.entries ?? []
  })

  request = computed(() => new OfferFindSuitableRequest(this.dateFrom(), this.dateTo(), this.visitorSize()))

  private offerCriteria = computed(() => ({
    request: this.request()
  }))

  visitorSizes = [
    {value: 1, label: 'OFFER.Filter.Size.SINGLE'},
    {value: 2, label: 'OFFER.Filter.Size.COUPLE'},
    {value: 4, label: 'OFFER.Filter.Size.FAMILY'},
    {value: 8, label: 'OFFER.Filter.Size.HUGE_GROUP'},
    {value: 15, label: 'OFFER.Filter.Size.SMALL_CLASS'},
    {value: 25, label: 'OFFER.Filter.Size.HUGE_CLASS'}
  ];

  private offerResource = resource({
    params: this.offerCriteria,
    loader: param => toPromise(this.service.findOffer(param.params.request), param.abortSignal)
  })

  entries = computed(() => this.offerResource.value()?.entries ?? [])
  reloading = this.offerResource.isLoading

  constructor(private service: OfferService) {
    this.range.valueChanges.subscribe(d => this.handleSelectionChange())
  }


  selectDay(day: string) {
    this.selectedDay.set(day);
    this.selectedOfferId.set(null);
  }

  selectOffer(offer: OfferReference) {
    this.selectedOfferId.set(offer.offer.id)
    this.offerSelected.emit(offer)
  }


  protected clearSelection() {
    this.range.get('start')?.setValue(null)
    this.range.get('end')?.setValue(null)
    this.range.reset()
    this.applyFilter()
  }


  protected handleSelectionChange() {
    let start = this.range.get('start')?.value
    let end = this.range.get('end')?.value
    if (this.range.invalid) return
    if (start != null && end != null) {
      this.applyFilter()
    }
  }

  protected applyFilter() {
    let filter = this.range.value
    this.dateFrom.set(filter.start?.toISO({includeOffset: false}))
    this.dateTo.set(filter.end?.toISO({includeOffset: false}))
  }
}
