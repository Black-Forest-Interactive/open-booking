import {Component, effect, inject, model, resource, signal} from '@angular/core';
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {Offer, OfferChangeRequest} from "@open-booking/core";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OfferService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {DateTime} from "luxon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {navigateToOffer} from "../../../app/app.navigation";

@Component({
  selector: 'app-offer-change',
  imports: [
    LoadingBarComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './offer-change.component.html',
  styleUrl: './offer-change.component.scss',
})
export class OfferChangeComponent {
  private route = inject(ActivatedRoute)
  id = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private offerResource = resource({
    params: this.id,
    loader: param => toPromise(this.service.getOffer(param.params), param.abortSignal)
  })

  data = model<Offer | null>(null)
  title = signal('OFFER.CHANGE.Create')
  reloading = signal(false)

  form: FormGroup


  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private toast: HotToastService,
    private translationService: TranslateService,
    private router: Router
  ) {
    this.form = this.fb.group({
        date: ['', Validators.required],
        startTime: ['', Validators.required],
        finishTime: ['', Validators.required],
        maxPersons: ['', Validators.required],
        active: ['', Validators.required],
      }
    )
    effect(() => {
      const offer = this.offerResource.value()
      if (offer) this.handleDataEdit(offer)
    })
  }

  private handleDataEdit(data: Offer) {
    this.data.set(data)
    this.initValues(data)
    this.translationService.get("OFFER.CHANGE.Update", {offer: data.id}).subscribe(text => this.title.set(text))
    this.validateForm()
    this.reloading.set(false)
  }

  private initValues(data: Offer) {
    let start = DateTime.fromISO(data.start)
    let finish = DateTime.fromISO(data.finish)
    this.setValue(start, this.form.get('startTime')!!, this.form.get('date')!!)
    this.setValue(finish, this.form.get('finishTime')!!, this.form.get('date')!!)
    this.form.get('maxPersons')?.setValue(data.maxPersons)
    this.form.get('active')?.setValue(data.active)
  }

  private setValue(date: DateTime, timeControl: AbstractControl, dateControl: AbstractControl) {
    let timeVal = date.toFormat("HH:mm")
    let dateVal = date
    timeControl.setValue(timeVal)
    dateControl.setValue(dateVal)
  }

  private validateForm() {
    this.form.markAllAsTouched()
  }

  cancel() {
    navigateToOffer(this.router)
  }

  onSubmit() {
    if (this.form.invalid) {
      this.validateForm()
      this.showFormInvalidError()
      return
    }

    this.reloading.set(true)
    let data = this.data()
    if (data) {
      this.update(data)
    } else {
      this.create()
    }
  }

  private showFormInvalidError() {
    this.translationService.get("OFFER.Message.FormInvalid").subscribe(
      msg => this.toast.error(msg)
    )
  }

  private get request(): OfferChangeRequest | null {
    let value = this.form.value
    let date = value.date
    let startTime = value.startTime
    let finishTime = value.finishTime

    let startDateTime = this.service.createDateTime(startTime, date)?.toISO()
    let finishDateTime = this.service.createDateTime(finishTime, date)?.toISO()
    let maxPersons = value.maxPersons
    let active = value.active
    if (!startDateTime || !finishDateTime) return null
    return new OfferChangeRequest(
      startDateTime,
      finishDateTime,
      maxPersons,
      active
    )
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createOffer(request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private update(offer: Offer) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateOffer(offer.id, request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private handleChangeResult(result: Offer) {
    if (result == null) {
      this.translationService.get("OFFER.Message.CreateFailure").subscribe(
        msg => this.toast.error(msg)
      )
    } else {
      this.translationService.get("OFFER.Message.CreateSuccess").subscribe(
        msg => {
          this.toast.success(msg)
          navigateToOffer(this.router)
        }
      )
    }
  }
}
