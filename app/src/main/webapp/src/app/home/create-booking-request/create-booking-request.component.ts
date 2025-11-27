import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {HomeService} from "../model/home.service";
import {DayInfoHelper, DayInfoOffer} from "../../offer/model/offer-api";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {Address, VisitorGroupChangeRequest} from "../../visitor-group/model/visitor-group-api";
import {MatDialog} from '@angular/material/dialog';
import {CreateBookingConfirmationDialogComponent} from "../create-booking-confirmation-dialog/create-booking-confirmation-dialog.component";
import {Location} from "@angular/common";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {CreateBookingFailedDialogComponent} from "../create-booking-failed-dialog/create-booking-failed-dialog.component";
import {BookingRequest} from "../../backoffice/request/model/booking-request-api";
import {CreateBookingRequest} from "../model/home-api";

@Component({
  selector: 'app-create-booking-request',
  templateUrl: './create-booking-request.component.html',
  styleUrls: ['./create-booking-request.component.scss'],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class CreateBookingRequestComponent {

  reloading = false
  offer: DayInfoOffer | undefined = undefined
  groupBookingPossible = false
  groupBookingSelected = false

  spaceAvailable: number = 0

  spacePlaceholder = ""

  formGroup = this.fb.group({
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
  });


  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private service: HomeService,
              private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
        let id = value.get('id')
        if (id) {
          this.reloading = true
          this.service.getOffer(+id).subscribe(d => this.handleOffer(d))
        }
      }
    )
  }

  back() {
    this.location.back()
  }

  get size() {
    return this.formGroup.get('size')
  }

  private handleOffer(d: DayInfoOffer) {
    this.offer = d

    this.spaceAvailable = DayInfoHelper.getSpaceAvailable(d)
    this.spacePlaceholder = (this.spaceAvailable > 0) ? "1 - " + this.spaceAvailable : ""

    this.groupBookingPossible = this.spaceAvailable >= d.offer.maxPersons
    let size = this.formGroup.get('size')
    if (size) {
      let value = +(size.value ?? "0")
      if (value > this.spaceAvailable) {
        size.setValue(this.spaceAvailable + '')
      }
      size.setValidators([Validators.required, Validators.min(1), Validators.max(this.spaceAvailable)])
    }
    this.reloading = false
  }


  submit() {
    if (this.formGroup.invalid) return
    if (this.reloading) return
    let value = this.formGroup.value
    let size = ((value.group) ? this.offer?.offer.maxPersons : +value.size!!)
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

    let offer = this.offer?.offer
    if (!offer) return
    let offerIds: number[] = [offer.id]

    let request = new CreateBookingRequest(
      visitorGroupRequest,
      offerIds,
      value.comment!!,
      value.termsAndConditions!!
    )
    this.reloading = true
    this.service.createBooking(request).subscribe({
      next: d => this.handleResult(d),
      error: (err) => this.handleError(err)
    })
  }

  private handleResult(d: BookingRequest) {
    this.reloading = false
    let dialogRef = this.dialog.open(CreateBookingConfirmationDialogComponent, {data: d})
    dialogRef.afterClosed().subscribe(() => this.router.navigate(['']))
  }

  handleGroupBookingChange(event: MatSlideToggleChange) {
    this.groupBookingSelected = event.checked
    if (this.groupBookingSelected) {
      this.formGroup.controls['size'].disable()
      let offer = this.offer?.offer
      if (offer) {
        this.size?.setValue(offer.maxPersons + '')
      }
    } else {
      this.formGroup.controls['size'].enable()
    }
  }

  private handleError(err: any) {
    this.reloading = false
    let dialogRef = this.dialog.open(CreateBookingFailedDialogComponent, {data: err})
    dialogRef.afterClosed().subscribe(() => this.router.navigate(['']))
  }

  showTermsAndConditions() {
    let newTab = window.open()
    // @ts-ignore
    this.service.getTermsAndConditionsUrl().subscribe(url => newTab.location.href = url.url)
  }
}
