import {Component, computed, effect, resource, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {Duration} from "luxon";
import {OfferRangeRequest} from "@open-booking/core";
import {GenericRequestResult, LoadingBarComponent, toPromise} from "@open-booking/shared";
import {navigateToOffer} from "../../../app/app.navigation";
import {Router} from "@angular/router";
import {OfferService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {of} from "rxjs";

@Component({
  selector: 'app-offer-create-range',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    TranslatePipe,
    LoadingBarComponent
  ],
  templateUrl: './offer-create-range.component.html',
  styleUrl: './offer-create-range.component.scss',
})
export class OfferCreateRangeComponent {

  date: FormGroup
  form: FormGroup

  private offerRangeCriteria = signal<OfferRangeRequest | null>(null)

  private offerRangeResource = resource({
    params: this.offerRangeCriteria,
    loader: param => toPromise(
      (param.params) ? this.service.createOfferRange(param.params) : of(), param.abortSignal
    )
  })

  reloading = computed(() => this.offerRangeResource.isLoading())


  constructor(
    private fb: FormBuilder,
    public service: OfferService,
    private toastService: HotToastService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.date = this.fb.group({
        dateFrom: new FormControl<Date | null>(null, Validators.required),
        dateTo: new FormControl<Date | null>(null, Validators.required),
      }
    )
    this.form = this.fb.group({
        date: this.date,
        timeFrom: ['', Validators.required],
        timeTo: ['', Validators.required],
        duration: ['', Validators.required],
        interval: ['', Validators.required],
        maxPersons: ['', Validators.required]
      }
    )

    effect(() => {
      const result = this.offerRangeResource.value()
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
      this.offerRangeCriteria.set(request)
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
    navigateToOffer(this.router)
  }

  private get request(): OfferRangeRequest | null {
    const value = this.form.value
    const date = value.date

    if (!date.dateFrom || !date.dateTo) return null

    const dateFrom = date.dateFrom.toFormat("yyyy-MM-dd")
    const dateTo = date.dateTo.toFormat("yyyy-MM-dd")
    const duration = Duration.fromObject({minutes: value.duration}).toISO()
    const interval = Duration.fromObject({minutes: value.interval}).toISO()

    return new OfferRangeRequest(
      value.maxPersons,
      dateFrom,
      dateTo,
      value.timeFrom,
      value.timeTo,
      duration,
      interval
    )
  }

  private handleResult(result: GenericRequestResult) {
    if (result == null || !result.success) {
      const message = (result == null) ? "OFFER.Message.RangeCreationFailed" : result.msg
      this.translate.get(message).subscribe(
        msg => {
          this.toastService.error(msg)
          navigateToOffer(this.router)
        }
      )
    } else {
      this.toastService.success("OFFER.Message.RangeCreatedSuccessfully")
      navigateToOffer(this.router)
    }
  }
}
