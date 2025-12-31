import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DayInfoService} from "../../../day-info/model/day-info.service";
import {DayInfo} from "../../../day-info/model/day-info-api";
import {DayInfoHelper, DayInfoOffer} from "../../../offer/model/offer-api";
import {Offer} from "../../offer/model/offer-api";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {Address, VisitorGroupChangeRequest} from "../../../visitor-group/model/visitor-group-api";
import {BookingRequestService} from "../model/booking-request.service";
import {BookingRequest, BookingRequestChangeRequest} from "../model/booking-request-api";
import {
  CreateBookingFailedDialogComponent
} from "../../../home/create-booking-failed-dialog/create-booking-failed-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.scss'],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class RequestCreateComponent {
  reloading: boolean = false

  offerSelectForm = this.fb.group({
    offer: ['', Validators.required],
  });
  visitorForm = this.fb.group({
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
    mail: [''],
    comment: [''],
    autoConfirm: [false],
    ignoreSizeCheck: [false],
  });

  selectedDay: DayInfo | undefined

  private subscription = this.infoService.reloading.subscribe(value => {
    if (!value) this.selectedDay = this.infoService.data[0]
  })


  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private service: BookingRequestService,
              public infoService: DayInfoService,
              private toastService: HotToastService,
              private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.infoService.loadDefaultDayInfo()
  }

  get selectedOffer(): Offer | null | undefined {
    return this.offerSelectForm.get('offer')?.value as Offer | null | undefined
  }

  get size() {
    return this.visitorForm.get('size')
  }

  get mail() {
    return this.visitorForm.get('mail')
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  getSpaceAvailable(info: DayInfoOffer) {
    return DayInfoHelper.getSpaceAvailable(info)
  }

  submit() {
    if (this.visitorForm.invalid) return
    if (this.offerSelectForm.invalid) return

    let value = this.visitorForm.value
    let size = +value.size!!
    if (!size) return;

    let visitorRequest = new VisitorGroupChangeRequest(
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

    let offer = this.selectedOffer
    if (!offer) return
    let offerIds: number[] = [offer.id]

    let request = new BookingRequestChangeRequest(
      visitorRequest,
      offerIds,
      value.comment!!,
      value.autoConfirm!!,
      value.ignoreSizeCheck!!
    )
    this.service.createBookingRequest(request).subscribe({
      next: d => this.handleResult(d),
      error: (err) => this.handleError(err)
    })
  }

  private handleResult(d: BookingRequest) {
    this.toastService.success("Booking created successfully")
    this.router.navigate(["backoffice", "booking", "details", d.id]).then()
  }

  private handleError(err: any) {
    let dialogRef = this.dialog.open(CreateBookingFailedDialogComponent, {data: err})
  }

}
