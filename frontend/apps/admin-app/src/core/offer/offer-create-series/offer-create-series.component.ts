import {Component, computed, effect, output, resource, signal} from '@angular/core';
import {GenericRequestResult, LoadingBarComponent, toPromise} from "@open-booking/shared";
import {OfferSeriesRequest} from "@open-booking/core";
import {Duration} from "luxon";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OfferService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {of} from "rxjs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-offer-create-series',
  imports: [
    LoadingBarComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './offer-create-series.component.html',
  styleUrl: './offer-create-series.component.scss',
})
export class OfferCreateSeriesComponent {
  form: FormGroup

  private offerSeriesCriteria = signal<OfferSeriesRequest | null>(null)

  private offerSeriesResource = resource({
    params: this.offerSeriesCriteria,
    loader: param => toPromise(
      (param.params) ? this.service.createOfferSeries(param.params) : of(), param.abortSignal
    )
  })

  reloading = computed(() => this.offerSeriesResource.isLoading())
  close = output<boolean>()

  constructor(
    private fb: FormBuilder,
    public service: OfferService,
    private toastService: HotToastService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
        date: ['', Validators.required],
        time: ['', Validators.required],
        duration: ['', Validators.required],
        interval: ['', Validators.required],
        quantity: ['', Validators.required],
        maxPersons: ['', Validators.required],
        minTime: ['', Validators.required],
        maxTime: ['', Validators.required],
      }
    )

    effect(() => {
      const result = this.offerSeriesResource.value()
      if (result !== undefined && result !== null) {
        this.handleResult(result)
      }
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.validateForm()
      this.showFormInvalidError()
      return
    }

    const request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.offerSeriesCriteria.set(request)
    }
  }

  private validateForm() {
    this.form.markAllAsTouched()
  }

  private showFormInvalidError() {
    this.translate.get("OFFER.Message.FormInvalid").subscribe(
      msg => this.toastService.error(msg)
    )
  }

  cancel() {
    this.close.emit(true)
  }

  private get request(): OfferSeriesRequest | null {
    const value = this.form.value
    const date = value.date
    const startTime = value.time
    const startDateTime = this.service.createDateTime(startTime, date)?.toISO()
    const duration = Duration.fromObject({minutes: value.duration}).toISO()
    const interval = Duration.fromObject({minutes: value.interval}).toISO()

    if (!startDateTime) return null

    return new OfferSeriesRequest(
      value.maxPersons,
      startDateTime,
      duration,
      interval,
      value.quantity,
      value.minTime,
      value.maxTime
    )
  }

  private handleResult(result: GenericRequestResult) {
    if (result == null || !result.success) {
      const message = (result == null) ? "OFFER.Message.SeriesCreationFailed" : result.msg
      this.translate.get(message).subscribe(
        msg => {
          this.toastService.error(msg)
          this.close.emit(true)
        }
      )
    } else {
      this.toastService.success("OFFER.Message.SeriesCreatedSuccessfully")
      this.close.emit(true)
    }
  }
}
