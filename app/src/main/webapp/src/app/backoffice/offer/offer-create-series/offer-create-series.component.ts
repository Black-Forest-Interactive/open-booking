import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {HotToastService} from "@ngneat/hot-toast";
import {OfferService} from "../model/offer.service";
import * as moment from "moment";
import {Location} from "@angular/common";
import {GenericRequestResult} from "../../../shared/shared-api";
import {OfferSeriesRequest} from "../model/offer-api";

@Component({
  selector: 'app-offer-create-series',
  templateUrl: './offer-create-series.component.html',
  styleUrls: ['./offer-create-series.component.scss']
})
export class OfferCreateSeriesComponent {
  reloading: boolean = false

  form: FormGroup = this.fb.group({
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

  constructor(private fb: FormBuilder,
              public service: OfferService,
              private toastService: HotToastService,
              private translate: TranslateService,
              private location: Location
  ) {
  }

  onSubmit() {
    if (this.form.invalid) {
      this.validateForm()
      this.showFormInvalidError()
      return
    }
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createOfferSeries(request).subscribe((result) => this.handleResult(result))
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
    this.location.back()
  }

  private get request(): OfferSeriesRequest | null {
    let value = this.form.value

    let date = value.date
    let startTime = value.time

    let startDateTime = this.service.createDateTime(startTime, date)?.format("YYYY-MM-DD[T]HH:mm:ss")
    let duration = moment.duration(value.duration, 'minutes').toISOString()
    let interval = moment.duration(value.interval, 'minutes').toISOString()
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
      let message = (result == null) ? "OFFER.Message.SeriesCreationFailed" : result.msg
      this.translate.get(message).subscribe(
        msg => {
          this.toastService.error(msg)
          this.location.back()
        }
      )
    } else {
      this.toastService.success("OFFER.Message.SeriesCreatedSuccessfully")
      this.location.back()
    }
  }
}
