import {Component, computed, output, resource} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {toPromise} from "@open-booking/shared";
import {GuideService, LabelService, OfferService} from "@open-booking/admin";
import {Offer, OfferChangeRequest} from "@open-booking/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {HotToastService} from "@ngxpert/hot-toast";

@Component({
  selector: 'app-offer-create-single',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './offer-create-single.component.html',
  styleUrl: './offer-create-single.component.scss',
})
export class OfferCreateSingleComponent {
  form: FormGroup

  private labelResource = resource({
    loader: (param) => toPromise(this.labelService.getAllLabelSorted(), param.abortSignal)
  })
  labels = computed(() => this.labelResource.value() ?? [])

  private guideResource = resource({
    loader: (param) => toPromise(this.guideService.getAllGuide(0, 100), param.abortSignal)
  })
  guides = computed(() => this.guideResource.value()?.content ?? [])

  reloading = computed(() => this.labelResource.isLoading() || this.guideResource.isLoading())

  close = output<boolean>()

  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private labelService: LabelService,
    private guideService: GuideService,
    private toastService: HotToastService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
        date: ['', Validators.required],
        startTime: ['', Validators.required],
        finishTime: ['', Validators.required],
        maxPersons: ['', Validators.required],
        active: [true, Validators.required],
        label: [''],
        guide: [''],
      }
    )
  }

  getSelectedLabelColor(): string {
    const selectedLabelId = this.form.get('label')?.value;
    return this.labels().find(label => label.id === selectedLabelId)?.color || '#cccccc';
  }

  private get request(): OfferChangeRequest | null {
    let value = this.form.value
    let date = value.date
    let startTime = value.startTime
    let finishTime = value.finishTime

    let startDateTime = this.service.createDateTime(startTime, date)?.toISO({includeOffset: false})
    let finishDateTime = this.service.createDateTime(finishTime, date)?.toISO({includeOffset: false})
    let maxPersons = value.maxPersons
    let active = value.active
    if (!startDateTime || !finishDateTime) return null
    return new OfferChangeRequest(
      startDateTime,
      finishDateTime,
      maxPersons,
      active,
      +(value.label),
      +(value.guide)
    )
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
      this.service.createOffer(request).subscribe({
        next: value => this.handleResult(value),
        error: err => this.handleError(err)
      })
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

  private handleResult(offer: Offer) {
    this.translate.get("OFFER.Message.SingleCreatedSuccessfully").subscribe(msg => {
        this.toastService.success()
        this.close.emit(true)
      }
    )
  }

  private handleError(err: any) {
    const message = (err == null) ? "OFFER.Message.SingleCreationFailed" : err
    this.translate.get(message).subscribe(
      msg => {
        this.toastService.error(msg)
        this.close.emit(true)
      }
    )
  }

  cancel() {
    this.close.emit(true)
  }

}
