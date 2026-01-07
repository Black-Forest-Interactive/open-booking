import {Component, computed, effect, input, output} from '@angular/core';
import {AddressChangeRequest, DayInfoOffer, VisitorChangeRequest, VisitorType} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CreateReservationRequest, SettingsService} from "@open-booking/portal";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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

  offer = input.required<DayInfoOffer>()

  spaceAvailable = input.required<number>()
  spacePlaceholder = computed(() => (this.spaceAvailable() > 0) ? "1 - " + this.spaceAvailable() : "")
  hasBookings = computed(() => this.offer().bookings.length > 0)


  data = input<CreateReservationRequest | undefined>(undefined)
  request = output<CreateReservationRequest>()
  back = output<boolean>()

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
  ) {
    this.form = this.fb.group({
      type: [VisitorType.SINGLE, Validators.required],
      title: [''],
      description: [''],
      size: [1, [Validators.required, Validators.min(1)]],
      minAge: ['', [Validators.required, Validators.min(0)]],
      maxAge: ['', [Validators.required, Validators.min(0)]],
      name: ['', Validators.required],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      termsAndConditions: [false, Validators.requiredTrue],
      comment: [''],
    })

    effect(() => {
      const available = this.spaceAvailable()
      const bookings = this.hasBookings()
      if (this.form) {
        this.updateSizeValidators()
      }
    })
    this.setupValidationRules()
  }


  private setupValidationRules(): void {
    // Rule 1: Title required when GROUP selected
    this.form.get('type')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(type => {
        const titleControl = this.form.get('title')

        if (type === VisitorType.GROUP) {
          titleControl?.setValidators([Validators.required])
        } else {
          titleControl?.clearValidators()
        }

        titleControl?.updateValueAndValidity()
        this.updateSizeValidators()
      });

    // Rule 2: Copy minAge to maxAge when size == 1
    this.form.get('size')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(size => {
        if (size === 1) {
          const minAge = this.form.get('minAge')?.value
          if (minAge) {
            this.form.get('maxAge')?.setValue(minAge, {emitEvent: false})
          }
        }
      });

    this.form.get('minAge')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(minAge => {
        const size = this.form.get('size')?.value
        if (size === 1) {
          this.form.get('maxAge')?.setValue(minAge, {emitEvent: false})
        }
      });
  }

  private updateSizeValidators(): void {
    const sizeControl = this.form.get('size')
    const type = this.form.get('type')?.value;
    const validators = [Validators.required, Validators.min(1)]

    // Rule 3: Disable max validator if GROUP and no bookings
    if (type === VisitorType.GROUP && this.hasBookings()) {
      validators.push(Validators.max(this.spaceAvailable()))
    } else if (type === VisitorType.SINGLE) {
      validators.push(Validators.max(this.spaceAvailable()))
    }
    // If GROUP and no bookings, don't add max validator

    sizeControl?.setValidators(validators)
    sizeControl?.updateValueAndValidity()
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
      new AddressChangeRequest('', value.city!!, value.zip!!),
      value.phone!!,
      value.mail!!
    )

    let offerId: number = this.offer().offer.id

    let request = new CreateReservationRequest(
      visitorRequest,
      offerId,
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
