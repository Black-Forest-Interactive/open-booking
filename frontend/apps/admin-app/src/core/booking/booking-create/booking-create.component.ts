import {Component, input, output, signal} from '@angular/core';
import {
  AddressChangeRequest,
  Assignment,
  Booking,
  BookingChangeRequest,
  BookingStatus,
  Offer,
  VisitorChangeRequest,
  VisitorType
} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BookingService} from "@open-booking/admin";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {HotToastService} from "@ngxpert/hot-toast";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {OfferBookingCapacityComponent} from "../../offer/offer-booking-capacity/offer-booking-capacity.component";
import {MatCheckboxModule} from "@angular/material/checkbox";

@Component({
  selector: 'app-booking-create',
  imports: [
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    OfferBookingCapacityComponent,
    TranslatePipe
  ],
  templateUrl: './booking-create.component.html',
  styleUrl: './booking-create.component.scss',
})
export class BookingCreateComponent {
  offer = input.required<Offer>()
  assignment = input.required<Assignment>()

  processing = signal(false)

  completed = output<boolean>()

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: BookingService,
    private translate: TranslateService,
    private toast: HotToastService,
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
      comment: [''],
      autoConfirm: [true, Validators.required],
      ignoreSizeCheck: [true, Validators.required],
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


  protected get size() {
    return this.form.get('size')
  }

  protected get type() {
    return this.form.get('type')
  }

  onReset() {
    this.form.reset()
  }

  onSubmit() {
    if (this.form.invalid) return
    if (this.processing()) return
    this.processing.set(true)
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

    let offerId: number = this.offer().id
    let request = new BookingChangeRequest(
      visitorRequest,
      value.comment ?? '',
      this.translate.getCurrentLang(),
      offerId,
      true, true
    )
    this.service.createBooking(request).subscribe({
      next: response => this.handleCreated(response),
      error: err => this.handleError(err),
      complete: () => {
        this.processing.set(false)
        this.completed.emit(true)
      }
    })
  }

  private handleCreated(response: Booking) {
    this.toast.success("")
  }

  private handleError(err: any) {
    this.toast.error(err)
  }

  protected readonly BookingStatus = BookingStatus;
  protected readonly VisitorType = VisitorType;
}
