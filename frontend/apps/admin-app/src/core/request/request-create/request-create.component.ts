import {Component, computed, effect, model, resource, signal} from '@angular/core';
import {HotToastService} from "@ngxpert/hot-toast";
import {MatDialog} from "@angular/material/dialog";
import {InfoService, RequestService} from "@open-booking/admin";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatStepperModule} from "@angular/material/stepper";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {TranslatePipe} from "@ngx-translate/core";
import {MatInputModule} from "@angular/material/input";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {DatePipe} from "@angular/common";
import {
  AddressChangeRequest,
  BookingRequest,
  BookingRequestChangeRequest,
  DateRangeSelectionRequest,
  DayInfo,
  DayInfoHelper,
  DayInfoOffer,
  Offer,
  VisitorChangeRequest
} from "@open-booking/core";
import {Router} from "@angular/router";
import {navigateToBookingDetails} from "../../booking/booking.routes";
import {
  CreateBookingFailedDialogComponent
} from "../create-booking-failed-dialog/create-booking-failed-dialog.component";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";

@Component({
  selector: 'app-request-create',
  imports: [
    MatCardModule,
    MatStepperModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    TranslatePipe,
    DatePipe,
    LoadingBarComponent
  ],
  templateUrl: './request-create.component.html',
  styleUrl: './request-create.component.scss',
})
export class RequestCreateComponent {

  offerSelectForm: FormGroup
  visitorForm: FormGroup

  private dayInfoResource = resource({
    loader: param => toPromise(this.infoService.getDayInfoRange(new DateRangeSelectionRequest('', '')))
  })

  entries = computed(() => this.dayInfoResource.value() ?? [])
  selectedDay = model<DayInfo | undefined>(undefined)
  offer = computed(() => this.selectedDay()?.offer ?? [])

  request = signal<BookingRequestChangeRequest | undefined>(undefined)
  private requestResource = resource({
    params: this.request,
    loader: param => toPromise(this.service.createBookingRequest(param.params), param.abortSignal)
  })

  reloading = computed(() => this.requestResource.isLoading() || this.dayInfoResource.isLoading())

  constructor(
    private fb: FormBuilder,
    private service: RequestService,
    private infoService: InfoService,
    private router: Router,
    private toast: HotToastService,
    private dialog: MatDialog
  ) {

    this.offerSelectForm = this.fb.group({
      offer: ['', Validators.required],
    })

    this.visitorForm = this.fb.group({
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
    })

    effect(() => this.selectedDay.set(this.entries()[0]))

  }

  getSpaceAvailable(info: DayInfoOffer) {
    return DayInfoHelper.getSpaceAvailable(info)
  }

  get selectedOffer(): Offer | null | undefined {
    return this.offerSelectForm.get('offer')?.value as Offer | null | undefined
  }

  get size() {
    return this.visitorForm.get('size')
  }

  submit() {
    if (this.visitorForm.invalid) return
    if (this.offerSelectForm.invalid) return

    let value = this.visitorForm.value
    let size = +value.size!!
    if (!size) return;

    let visitorGroupRequest = new VisitorChangeRequest(
      "",
      value.title!!,
      "",
      size,
      +value.minAge!!,
      +value.maxAge!!,
      value.contact!!,
      new AddressChangeRequest(value.street!!, value.city!!, value.zip!!),
      value.phone!!,
      value.mail!!
    )

    let offer = this.selectedOffer
    if (!offer) return
    let offerIds: number[] = [offer.id]

    let request = new BookingRequestChangeRequest(
      visitorGroupRequest,
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
    this.toast.success("Booking created successfully")
    navigateToBookingDetails(this.router, d.id)
  }

  private handleError(err: any) {
    this.dialog.open(CreateBookingFailedDialogComponent, {data: err})
  }

}
