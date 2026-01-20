import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {PortalBooking} from "@open-booking/portal";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-booking-cancel-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './booking-cancel-dialog.component.html',
  styleUrl: './booking-cancel-dialog.component.scss',
})
export class BookingCancelDialogComponent {
  private dialogRef = inject(MatDialogRef<BookingCancelDialogComponent>)
  data = inject<PortalBooking>(MAT_DIALOG_DATA)

}
