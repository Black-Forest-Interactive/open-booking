import {Component, computed, effect, input, output} from '@angular/core';
import {Address, CreateBookingRequest, DayInfoOffer, VisitorGroupChangeRequest} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SettingsService} from "@open-booking/portal";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {MatSlideToggleChange, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButtonModule} from "@angular/material/button";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-booking-checkout',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatCard
  ],
  templateUrl: './booking-checkout.component.html',
  styleUrl: './booking-checkout.component.scss',
})
export class BookingCheckoutComponent {

  spaceAvailable = input.required<number>()
  entries = input.required<DayInfoOffer[]>()
  preferredEntry = input.required<DayInfoOffer>()


  spacePlaceholder = computed(() => (this.spaceAvailable() > 0) ? "1 - " + this.spaceAvailable() : "")
  groupBookingPossible = computed(() => this.spaceAvailable() >= (this.preferredEntry()?.offer?.maxPersons ?? 0))
  groupBookingSelected = false

  request = output<CreateBookingRequest>()


  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      size: ['', [Validators.required, Validators.min(1)]],
      group: [false],
      minAge: ['', [Validators.required, Validators.min(0)]],
      maxAge: ['', [Validators.required, Validators.min(0)]],
      contact: ['', Validators.required],
      street: [''],
      zip: [''],
      city: [''],
      phone: ['', Validators.required],
      mail: ['', Validators.required],
      termsAndConditions: [false, Validators.requiredTrue],
      comment: [''],
    })
    effect(() => {
        let size = this.form.get('size')
        if (size) {
          let value = +(size.value ?? "0")
          if (value > this.spaceAvailable()) {
            size.setValue(this.spaceAvailable() + '')
          }
          size.setValidators([Validators.required, Validators.min(1), Validators.max(this.spaceAvailable())])
        }
      }
    )
  }

  get size() {
    return this.form.get('size')
  }

  submit() {
    if (this.form.invalid) return
    let value = this.form.value
    let size = ((value.group) ? this.spaceAvailable() : +value.size!!)
    if (!size) return

    let visitorGroupRequest = new VisitorGroupChangeRequest(
      value.title!!,
      size,
      value.group!!,
      +value.minAge!!,
      +value.maxAge!!,
      value.contact!!,
      new Address(value.street!!, value.city!!, value.zip!!),
      value.phone!!,
      value.mail!!
    )

    let offerIds: number[] = this.entries().map(e => e.offer.id)

    let request = new CreateBookingRequest(
      visitorGroupRequest,
      offerIds,
      value.comment!!,
      value.termsAndConditions!!
    )
    this.request.emit(request)
  }


  protected showTermsAndConditions() {
    let newTab = window.open()
    if (!newTab) return
    this.settingsService.getTermsAndConditionsUrl().subscribe(url => newTab.location.href = url.url)
  }

  protected handleGroupBookingChange(event: MatSlideToggleChange) {
    this.groupBookingSelected = event.checked
    if (this.groupBookingSelected) {
      this.form.controls['size'].disable()
      let offer = this.preferredEntry()?.offer
      if (offer) {
        this.size?.setValue(offer.maxPersons + '')
      }
    } else {
      this.form.controls['size'].enable()
    }
  }

}
