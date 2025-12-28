import {Component, computed, effect, inject, resource, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule, Location} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {BookingService, OfferService, SettingsService} from "@open-booking/portal";
import {
  Address,
  BookingRequest,
  CreateBookingRequest,
  DayInfoHelper,
  VisitorGroupChangeRequest
} from "@open-booking/core";
import {MatSlideToggleChange, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {
  CreateBookingConfirmationDialogComponent
} from "../create-booking-confirmation-dialog/create-booking-confirmation-dialog.component";
import {
  CreateBookingFailedDialogComponent
} from "../create-booking-failed-dialog/create-booking-failed-dialog.component";

@Component({
  selector: 'app-create-booking-request',
  imports: [
    CommonModule,
    LoadingBarComponent,
    TranslatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  templateUrl: './create-booking-request.component.html',
  styleUrl: './create-booking-request.component.scss',
})
export class CreateBookingRequestComponent {

  private route = inject(ActivatedRoute)
  private offerId = toSignal(this.route.paramMap.pipe(
    map(params => {
      let id = params.get('id')
      return (id) ? +id : -1
    })
  ))

  private offerResource = resource({
    params: this.offerId,
    loader: (param) => {
      return toPromise(this.service.getOffer(param.params ?? -1), param.abortSignal)
    }
  })

  offer = computed(() => this.offerResource.value())
  reloading = this.offerResource.isLoading

  spaceAvailable = computed(() => DayInfoHelper.getSpaceAvailable(this.offer()))
  spacePlaceholder = computed(() => (this.spaceAvailable() > 0) ? "1 - " + this.spaceAvailable() : "")

  groupBookingPossible = computed(() => this.spaceAvailable() >= (this.offer()?.offer?.maxPersons ?? 0))
  groupBookingSelected = false

  processing = signal(false)


  formGroup: FormGroup

  constructor(private fb: FormBuilder,
              private router: Router,
              private location: Location,
              private service: OfferService,
              private bookingService: BookingService,
              private settingsService: SettingsService,
              private dialog: MatDialog
  ) {
    this.formGroup = this.createForm()

    effect(() => {
        let size = this.formGroup.get('size')
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


  private createForm() {
    return this.fb.group({
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
  }

  back() {
    this.location.back()
  }

  get size() {
    return this.formGroup.get('size')
  }


  submit() {
    if (this.formGroup.invalid) return
    if (this.reloading()) return
    let value = this.formGroup.value
    let size = ((value.group) ? this.offer()?.offer.maxPersons : +value.size!!)
    if (!size) return;

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

    let offer = this.offer()?.offer
    if (!offer) return
    let offerIds: number[] = [offer.id]

    let request = new CreateBookingRequest(
      visitorGroupRequest,
      offerIds,
      value.comment!!,
      value.termsAndConditions!!
    )
    this.processing.set(true)
    this.bookingService.createBooking(request).subscribe({
      next: v => this.handleResult(v),
      error: err => this.handleError(err),
      complete: () => this.processing.set(false)
    })
  }

  private handleResult(d: BookingRequest) {
    let dialogRef = this.dialog.open(CreateBookingConfirmationDialogComponent, {data: d})
    dialogRef.afterClosed().subscribe(() => this.router.navigate(['']))
  }

  private handleError(err: any) {
    let dialogRef = this.dialog.open(CreateBookingFailedDialogComponent, {data: err})
    dialogRef.afterClosed().subscribe(() => this.router.navigate(['']))
  }

  handleGroupBookingChange(event: MatSlideToggleChange) {
    this.groupBookingSelected = event.checked
    if (this.groupBookingSelected) {
      this.formGroup.controls['size'].disable()
      let offer = this.offer()?.offer
      if (offer) {
        this.size?.setValue(offer.maxPersons + '')
      }
    } else {
      this.formGroup.controls['size'].enable()
    }
  }

  showTermsAndConditions() {
    let newTab = window.open()
    if (!newTab) return
    this.settingsService.getTermsAndConditionsUrl().subscribe(url => newTab.location.href = url.url)
  }

}
