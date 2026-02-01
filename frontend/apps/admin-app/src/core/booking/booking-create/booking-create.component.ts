import {Component, computed, effect, input, output, resource, signal} from '@angular/core';
import {
  AddressChangeRequest,
  Assignment,
  Booking,
  BookingChangeRequest,
  BookingConfirmationContent,
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
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {QuillModule} from "ngx-quill";
import {GenericRequestResult, toPromise} from "@open-booking/shared";
import {of} from "rxjs";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-booking-create',
  imports: [
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    QuillModule,
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
  booking = signal<Booking | null>(null)

  private bookingResource = resource({
    params: this.booking,
    loader: param => toPromise(param.params ? this.service.getBookingInfo(param.params.id) : of(null), param.abortSignal)
  })

  private responseResource = resource({
    params: this.booking,
    loader: param => toPromise(param.params ? this.service.getConfirmResponse(param.params.id) : of(null), param.abortSignal)
  })

  loading = computed(() => this.bookingResource.isLoading() || this.responseResource.isLoading())
  bookingInfo = computed(() => this.bookingResource.value())
  response = computed(() => this.responseResource.value())
  result = signal<GenericRequestResult | null>(null)


  completed = output<boolean>()
  cancel = output<boolean>()

  requestForm: FormGroup

  responseForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: BookingService,
    private translate: TranslateService,
    private toast: HotToastService,
  ) {
    this.requestForm = this.fb.group({
      type: [VisitorType.SINGLE, Validators.required],
      title: [''],
      description: [''],
      size: ['', [Validators.required, Validators.min(1)]],
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

    this.responseForm = fb.group({
        subject: ['', Validators.required],
        content: ['', Validators.required],
        silent: [false, Validators.required],
      }
    )
    effect(() => {
      let response = this.response()
      if (response) this.responseForm.patchValue({
        subject: response.title,
        content: response.content,
        silent: false
      })
    });
  }


  private setupValidationRules(): void {
    // Rule 1: Title required when GROUP selected
    this.requestForm.get('type')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(type => {
        const titleControl = this.requestForm.get('title')

        if (type === VisitorType.GROUP) {
          titleControl?.setValidators([Validators.required])
        } else {
          titleControl?.clearValidators()
        }

        titleControl?.updateValueAndValidity()
      });

    // Rule 2: Copy minAge to maxAge when size == 1
    this.requestForm.get('size')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(size => {
        if (size === 1) {
          const minAge = this.requestForm.get('minAge')?.value
          if (minAge) {
            this.requestForm.get('maxAge')?.setValue(minAge, {emitEvent: false})
          }
        }
      });

    this.requestForm.get('minAge')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(minAge => {
        const size = this.requestForm.get('size')?.value
        if (size === 1) {
          this.requestForm.get('maxAge')?.setValue(minAge, {emitEvent: false})
        }
      });
  }


  protected get size() {
    return this.requestForm.get('size')
  }

  protected get type() {
    return this.requestForm.get('type')
  }

  onReset() {
    this.requestForm.reset()
  }

  onSubmitRequest() {
    if (this.requestForm.invalid) return
    if (this.processing()) return
    this.processing.set(true)
    let value = this.requestForm.value

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
    let autoConfirm = value.autoConfirm
    let ignoreSizeCheck = value.ignoreSizeCheck
    let request = new BookingChangeRequest(
      visitorRequest,
      value.comment ?? '',
      this.translate.getCurrentLang(),
      offerId,
      false, ignoreSizeCheck, true
    )
    this.service.createBooking(request).subscribe({
      next: response => this.handleCreated(autoConfirm, response),
      error: err => this.handleError(err),
    })
  }

  onSubmitResponse() {
    if (this.responseForm.invalid) return
    if (this.processing()) return
    this.processing.set(true)
    let bookingId = this.booking()?.id
    if (!bookingId) return
    let value = this.responseForm.value

    let content = new BookingConfirmationContent(
      value.subject ?? "",
      value.content ?? "",
      value.silent ?? false
    )

    this.service.confirmBooking(bookingId, content).subscribe({
      next: v => this.result.set(v),
      error: err => this.handleError(err),
      complete: () => this.processing.set(false)
    })
  }

  private handleCreated(autoConfirm: boolean, response: Booking) {
    this.toast.success("Booking created successfully")
    if (autoConfirm) {
      this.booking.set(response)
      this.processing.set(false)
    } else {
      this.handleCompleted()
    }
  }

  private handleError(err: any) {
    this.toast.error(err)
    this.handleCompleted()
  }

  private handleCompleted() {
    this.completed.emit(true)
    this.processing.set(false)
  }

  protected readonly BookingStatus = BookingStatus;
  protected readonly VisitorType = VisitorType;
}
