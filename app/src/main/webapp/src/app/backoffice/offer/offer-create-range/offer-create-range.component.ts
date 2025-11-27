import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OfferService} from "../model/offer.service";
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from "@ngx-translate/core";
import {Location} from "@angular/common";
import * as moment from "moment/moment";
import {GenericRequestResult} from "../../../shared/shared-api";
import {OfferRangeRequest} from "../model/offer-api";

@Component({
  selector: 'app-offer-create-range',
  templateUrl: './offer-create-range.component.html',
  styleUrls: ['./offer-create-range.component.scss']
})
export class OfferCreateRangeComponent {
  reloading: boolean = false

  date = this.fb.group({
      dateFrom: new FormControl<Date | null>(null, Validators.required),
      dateTo: new FormControl<Date | null>(null, Validators.required),
    }
  )

  form: FormGroup = this.fb.group({
      date: this.date,
      timeFrom: ['', Validators.required],
      timeTo: ['', Validators.required],
      duration: ['', Validators.required],
      interval: ['', Validators.required],
      maxPersons: ['', Validators.required]
    }
  )

  constructor(private fb: FormBuilder,
              public service: OfferService,
              private toastService: HotToastService,
              private translationService: TranslateService,
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
      this.service.createOfferRange(request).subscribe((result) => this.handleResult(result))
    }
  }

  private validateForm() {
    this.form.markAllAsTouched()
  }

  private showFormInvalidError() {
    this.translationService.get("OFFER.Message.FormInvalid").subscribe(
      msg => this.toastService.error(msg)
    )
  }


  cancel() {
    this.location.back()
  }

  private get request(): OfferRangeRequest {
    let value = this.form.value
    let date = value.date
    let dateFrom = moment(date.dateFrom).format("YYYY-MM-DD")
    let dateTo = moment(date.dateTo).format("YYYY-MM-DD")
    let duration = moment.duration(value.duration, 'minutes').toISOString()
    let interval = moment.duration(value.interval, 'minutes').toISOString()
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
      let message = (result == null) ? "OFFER.Message.RangeCreationFailed" : result.msg
      this.translationService.get(message).subscribe(
        msg => {
          this.toastService.error(msg)
          this.location.back()
        }
      )
    } else {
      this.toastService.success("OFFER.Message.RangeCreatedSuccessfully")
      this.location.back()
    }
  }
}
