import {Component, computed, resource} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {HotToastService} from "@ngxpert/hot-toast";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {toSignal} from "@angular/core/rxjs-interop";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {InfoService} from "@open-booking/admin";
import {DateRangeSelectionRequest} from "@open-booking/core";
import {DateTime} from "luxon";
import {MatIconModule} from "@angular/material/icon";
import {BookingEntryComponent} from "./booking-entry/booking-entry.component";

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    ReactiveFormsModule,
    LoadingBarComponent,
    BookingEntryComponent,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {

  start = new FormControl<DateTime | null>(null, Validators.required)
  end = new FormControl<DateTime | null>(null, Validators.required)

  range = new FormGroup({
    start: this.start,
    end: this.end
  })

  private rangeSignal = toSignal(this.range.valueChanges)
  private dayInfoCriteria = computed(() =>
    new DateRangeSelectionRequest(this.rangeSignal()?.start?.toISODate() ?? '', this.rangeSignal()?.end?.toISODate() ?? '')
  )

  private dayInfoResource = resource({
    params: this.dayInfoCriteria,
    loader: param => toPromise(this.service.getDayInfoRange(param.params), param.abortSignal)
  })

  reloading = computed(() => this.dayInfoResource.isLoading())
  data = computed(() => this.dayInfoResource.value() ?? [])

  constructor(private service: InfoService, private toast: HotToastService, private router: Router, private activatedRoute: ActivatedRoute) {
    // TODO sync settings with query params in url
  }

  protected clearSelection() {
    this.range.reset()
  }
}
