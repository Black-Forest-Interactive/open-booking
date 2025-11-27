import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-booking-failed-dialog',
  templateUrl: './create-booking-failed-dialog.component.html',
  styleUrls: ['./create-booking-failed-dialog.component.scss']
})
export class CreateBookingFailedDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateBookingFailedDialogComponent>,
  ) {
    console.log(data)
  }


}
