import {Component, inject, signal} from '@angular/core';
import {Assignment, Booking, BookingStatus, OfferInfo, VisitorType} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {BookingCreateComponent} from "../booking-create/booking-create.component";

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
    DatePipe,
    BookingCreateComponent
  ],
  templateUrl: './booking-create-dialog.component.html',
  styleUrl: './booking-create-dialog.component.scss',
})
export class BookingCreateDialogComponent {
  data = inject<{ offer: OfferInfo, assignment: Assignment }>(MAT_DIALOG_DATA)

  booking = signal<Booking | null>(null)

  constructor(
    private reference: MatDialogRef<BookingCreateDialogComponent>
  ) {

  }


  protected close() {
    this.reference.close()
  }


  protected readonly BookingStatus = BookingStatus;
  protected readonly VisitorType = VisitorType;


}
