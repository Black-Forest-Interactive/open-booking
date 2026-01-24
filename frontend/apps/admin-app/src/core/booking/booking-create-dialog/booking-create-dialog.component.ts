import {Component, inject} from '@angular/core';
import {
  AddressChangeRequest,
  Assignment,
  Booking,
  BookingChangeRequest,
  BookingStatus,
  OfferInfo,
  VisitorChangeRequest,
  VisitorType
} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {OfferBookingCapacityComponent} from "../../offer/offer-booking-capacity/offer-booking-capacity.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {BookingService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";

@Component({
  selector: 'app-booking-create-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    TranslatePipe,
    OfferBookingCapacityComponent,
    DatePipe
  ],
  templateUrl: './booking-create-dialog.component.html',
  styleUrl: './booking-create-dialog.component.scss',
})
export class BookingCreateDialogComponent {
  data = inject<{ offer: OfferInfo, assignment: Assignment }>(MAT_DIALOG_DATA)


  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: BookingService,
    private translate: TranslateService,
    private toast: HotToastService,
    private reference: MatDialogRef<BookingCreateDialogComponent>
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
      comment: ['']
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

  get size() {
    return this.form.get('size')
  }

  get type() {
    return this.form.get('type')
  }

  protected close() {
    this.reference.close()
  }

  protected onSubmit() {
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

    let offerId: number = this.data.offer.offer.id
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
      complete: () => this.reference.close()
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
