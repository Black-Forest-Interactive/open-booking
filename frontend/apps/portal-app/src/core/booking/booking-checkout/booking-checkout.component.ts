import {Component, computed, effect, input, output, Signal} from '@angular/core';
import {Address, CreateBookingRequest, DayInfoOffer, VisitorChangeRequest} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SettingsService} from "@open-booking/portal";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {MatSlideToggleChange, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButtonModule} from "@angular/material/button";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@Component({
  selector: 'app-booking-checkout',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    TranslatePipe
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


  data = input<CreateBookingRequest | undefined>(undefined)
  request = output<CreateBookingRequest>()
  back = output<boolean>()

  private formValueChanges: Signal<any>
  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
  ) {
    this.form = this.fb.group({
      type: ['single', Validators.required],
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
      let request = this.data()
      if (request) {
        let value = {
          title: request.visitorGroupChangeRequest.title,
          size: request.visitorGroupChangeRequest.size,
          group: request.visitorGroupChangeRequest.isGroup,
          minAge: request.visitorGroupChangeRequest.minAge,
          maxAge: request.visitorGroupChangeRequest.maxAge,
          contact: request.visitorGroupChangeRequest.contact,
          street: request.visitorGroupChangeRequest.address.street,
          zip: request.visitorGroupChangeRequest.address.zip,
          city: request.visitorGroupChangeRequest.address.city,
          phone: request.visitorGroupChangeRequest.phone,
          mail: request.visitorGroupChangeRequest.email,
          termsAndConditions: request.termsAndConditions,
          comment: request.comment,
        }
        this.form.setValue(value)
      }
    })
    this.formValueChanges = toSignal(this.form.valueChanges)
    effect(() => {
      const formValue = this.formValueChanges()
      if (!formValue) return
      const availableSpace = this.spaceAvailable()

      const type = formValue.type

      // If only 1 space available, force single mode
      if (availableSpace === 1 && type !== 'single') {
        this.form.patchValue({bookingType: 'single'}, {emitEvent: false})
      }

      if (type === 'single') {
        if (this.form.get('title')?.value !== 'single visitor' || formValue.size !== 1) {
          this.form.patchValue({
            title: 'single visitor',
            size: 1,
            maxAge: formValue.minAge
          }, {emitEvent: false});
        }
      }

      if (type === 'group') {
        let size = formValue.size ?? 0
        let minSize = 2
        if (size > availableSpace) {
          this.form.patchValue({size: availableSpace}, {emitEvent: false})
        } else if (size < minSize) {
          this.form.patchValue({size: minSize}, {emitEvent: false})
        }
        if (formValue.title == 'single visitor') {
          this.form.patchValue({title: ''}, {emitEvent: false})
        }
        const sizeControl = this.form.get('size')
        if (sizeControl) sizeControl.setValidators([Validators.required, Validators.min(minSize), Validators.max(this.spaceAvailable())])
      }

      // Sync minAge to maxAge when size is 1 (in any mode)
      if (formValue.size === 1) {
        const currentMaxAge = this.form.get('maxAge')?.value;
        if (currentMaxAge !== formValue.minAge) {
          this.form.patchValue({
            maxAge: formValue.minAge
          }, {emitEvent: false});
        }
      }
    })
  }


  get size() {
    return this.form.get('size')
  }

  get type() {
    return this.form.get('type')
  }

  submit() {
    if (this.form.invalid) return
    let value = this.form.value
    let size = ((value.group) ? this.spaceAvailable() : +value.size!!)
    if (!size) return

    let visitorGroupRequest = new VisitorChangeRequest(
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
