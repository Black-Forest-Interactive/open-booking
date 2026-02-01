import {Component, computed, effect, output, resource, signal} from '@angular/core';
import {GenericRequestResult, LoadingBarComponent, toPromise} from "@open-booking/shared";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OfferService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {of} from "rxjs";
import {OfferChangeDurationRequest} from "@open-booking/core";
import {Duration} from "luxon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-offer-change-duration',
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
  templateUrl: './offer-change-duration.component.html',
  styleUrl: './offer-change-duration.component.scss',
})
export class OfferChangeDurationComponent {

  private changeDurationCriteria = signal<OfferChangeDurationRequest | null>(null)

  private changeDurationResource = resource({
    params: this.changeDurationCriteria,
    loader: param => toPromise(
      (param.params) ? this.service.changeDuration(param.params) : of(), param.abortSignal
    )
  })

  reloading = computed(() => this.changeDurationResource.isLoading())

  close = output<boolean>()

  date: FormGroup
  form: FormGroup


  constructor(
    private fb: FormBuilder,
    public service: OfferService,
    private toastService: HotToastService,
    private translate: TranslateService
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
      }
    )

    effect(() => {
      const result = this.changeDurationResource.value()
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
      this.changeDurationCriteria.set(request)
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

  private get request(): OfferChangeDurationRequest | null {
    const value = this.form.value
    const date = value.date

    if (!date.dateFrom || !date.dateTo) return null

    const dateFrom = date.dateFrom.toFormat("yyyy-MM-dd")
    const dateTo = date.dateTo.toFormat("yyyy-MM-dd")
    const duration = Duration.fromObject({minutes: value.duration}).toISO()

    return new OfferChangeDurationRequest(
      dateFrom,
      dateTo,
      value.timeFrom,
      value.timeTo,
      duration
    )
  }

  private handleResult(result: GenericRequestResult) {
    if (result == null || !result.success) {
      const message = (result == null) ? "OFFER.Message.ChangeDurationFailed" : result.msg
      this.translate.get(message).subscribe(
        msg => {
          this.toastService.error(msg)
          this.close.emit(true)
        }
      )
    } else {
      this.toastService.success("OFFER.Message.ChangeDurationSuccessfully")
      this.close.emit(true)
    }
  }
}
