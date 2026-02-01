import {Component, inject} from '@angular/core';
import {AddressChangeRequest, BookingChangeRequest, BookingDetails, VisitorChangeRequest} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingOfferChangeComponent} from "../booking-offer-change/booking-offer-change.component";

@Component({
  selector: 'app-booking-offer-change-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslatePipe,
    BookingOfferChangeComponent
  ],
  templateUrl: './booking-offer-change-dialog.component.html',
  styleUrl: './booking-offer-change-dialog.component.scss',
})
export class BookingOfferChangeDialogComponent {
  data = inject<BookingDetails>(MAT_DIALOG_DATA)

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private reference: MatDialogRef<BookingOfferChangeDialogComponent>
  ) {
    this.form = this.fb.group({
      size: [this.data.visitor.size, [Validators.required, Validators.min(1)]],
      minAge: [this.data.visitor.minAge, [Validators.required, Validators.min(0)]],
      maxAge: [this.data.visitor.maxAge, [Validators.required, Validators.min(0)]],
      offerId: [this.data.offer.offer.id, [Validators.required, Validators.min(1)]]
    })
  }

  onSave() {
    if (!this.form.valid) return

    let value = this.form.value
    if (!value) return
    let visitor = this.data.visitor;
    let visitorRequest = new VisitorChangeRequest(
      visitor.type,
      visitor.title,
      visitor.description,
      +value.size!!,
      +value.minAge!!,
      +value.maxAge!!,
      visitor.name,
      new AddressChangeRequest(visitor.address.street, visitor.address.zip, visitor.address.city),
      visitor.phone,
      visitor.email
    )

    let booking = this.data.booking
    let request = new BookingChangeRequest(visitorRequest, booking.comment, booking.lang, value.offerId, true, true, false)
    this.reference.close(request)
  }

  onCancel() {
    this.reference.close(null)
  }

}
