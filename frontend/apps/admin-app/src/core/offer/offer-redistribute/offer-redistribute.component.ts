import {Component, computed, effect, input, output, resource, signal} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OfferService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {OfferRedistributeRequest} from "@open-booking/core";
import {GenericRequestResult, LoadingBarComponent, toPromise} from "@open-booking/shared";
import {of} from "rxjs";
import {Duration} from "luxon";

@Component({
  selector: 'app-offer-redistribute',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslatePipe,
    LoadingBarComponent
  ],
  templateUrl: './offer-redistribute.component.html',
  styleUrl: './offer-redistribute.component.scss',
})
export class OfferRedistributeComponent {
  date = input.required<string>()

  private redistributeCriteria = signal<OfferRedistributeRequest | null>(null)

  private redistributeResource = resource({
    params: this.redistributeCriteria,
    loader: param => toPromise(
      (param.params) ? this.service.redistributeOffer(param.params) : of(), param.abortSignal
    )
  })

  reloading = computed(() => this.redistributeResource.isLoading())

  close = output<boolean>()

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    public service: OfferService,
    private toastService: HotToastService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
        timeFrom: ['', Validators.required],
        timeTo: ['', Validators.required],
        duration: ['', Validators.required],
      }
    )

    effect(() => {
      const result = this.redistributeResource.value()
      if (result !== undefined && result !== null) {
        this.handleResult(result)
      }
    })
  }

  protected onSubmit() {
    if (this.form.invalid) {
      this.validateForm()
      this.showFormInvalidError()
      return
    }

    const request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.redistributeCriteria.set(request)
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

  private get request(): OfferRedistributeRequest | null {
    const value = this.form.value
    const duration = Duration.fromObject({minutes: value.duration}).toISO()

    return new OfferRedistributeRequest(
      this.date(),
      value.timeFrom,
      value.timeTo,
      duration
    )
  }

  protected cancel() {
    this.close.emit(true)
  }

  private handleResult(result: GenericRequestResult) {
    if (result == null || !result.success) {
      const message = (result == null) ? "OFFER.Message.RedistributeFailed" : result.msg
      this.translate.get(message).subscribe(
        msg => {
          this.toastService.error(msg)
          this.close.emit(true)
        }
      )
    } else {
      this.toastService.success("OFFER.Message.RedistributeSuccessfully")
      this.close.emit(true)
    }
  }
}
