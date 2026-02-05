import {Component, inject} from '@angular/core';
import {AddressChangeRequest, BookingChangeRequest, BookingDetails, VisitorChangeRequest} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
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

  constructor(
    private reference: MatDialogRef<BookingOfferChangeDialogComponent>
  ) {

  }

  onSave(value: any) {
    if (!value) return
    let visitor = this.data.visitor
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
    debugger
    let booking = this.data.booking
    let request = new BookingChangeRequest(visitorRequest, booking.comment, booking.lang, value.offerId, false, true, false)
    this.reference.close(request)
  }

  onCancel() {
    this.reference.close(null)
  }

}
