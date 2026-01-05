import {Component, computed, effect, input, output, Signal} from '@angular/core';
import {AddressChangeRequest, DayInfoOffer, VisitorChangeRequest, VisitorType} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CreateReservationRequest, SettingsService} from "@open-booking/portal";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButtonModule} from "@angular/material/button";
import {toSignal} from "@angular/core/rxjs-interop";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@Component({
  selector: 'app-reservation-checkout',
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
  templateUrl: './reservation-checkout.component.html',
  styleUrl: './reservation-checkout.component.scss',
})
export class ReservationCheckoutComponent {

  spaceAvailable = input.required<number>()
  entries = input.required<DayInfoOffer[]>()
  preferredEntry = input.required<DayInfoOffer>()

  spacePlaceholder = computed(() => (this.spaceAvailable() > 0) ? "1 - " + this.spaceAvailable() : "")


  data = input<CreateReservationRequest | undefined>(undefined)
  request = output<CreateReservationRequest>()
  back = output<boolean>()

  private formValueChanges: Signal<any>
  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
  ) {
    this.form = this.fb.group({
      type: [VisitorType.GROUP, Validators.required],
      title: ['', Validators.required],
      description: [''],
      size: ['', [Validators.required, Validators.min(1)]],
      minAge: ['', [Validators.required, Validators.min(0)]],
      maxAge: ['', [Validators.required, Validators.min(0)]],
      name: ['', Validators.required],
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
          type: request.visitor.type,
          title: request.visitor.title,
          description: request.visitor.description,
          size: request.visitor.size,
          minAge: request.visitor.minAge,
          maxAge: request.visitor.maxAge,
          name: request.visitor.name,
          street: request.visitor.address.street,
          zip: request.visitor.address.zip,
          city: request.visitor.address.city,
          phone: request.visitor.phone,
          mail: request.visitor.email,
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
      if (availableSpace === 1 && type !== VisitorType.SINGLE) {
        this.form.patchValue({bookingType: VisitorType.SINGLE}, {emitEvent: false})
      }

      if (type === VisitorType.SINGLE) {
        if (this.form.get('title')?.value !== 'single visitor' || formValue.size !== 1) {
          this.form.patchValue({
            title: 'single visitor',
            size: 1,
            maxAge: formValue.minAge
          }, {emitEvent: false});
        }
      }

      if (type === VisitorType.GROUP) {
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

    let visitorRequest = new VisitorChangeRequest(
      value.type,
      value.title!!,
      value.description!!,
      +value.size!!,
      +value.minAge!!,
      +value.maxAge!!,
      value.name!!,
      new AddressChangeRequest(value.street!!, value.city!!, value.zip!!),
      value.phone!!,
      value.mail!!
    )

    let offerIds: number[] = this.entries().map(e => e.offer.id)

    let request = new CreateReservationRequest(
      visitorRequest,
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


  protected readonly VisitorType = VisitorType;
}
