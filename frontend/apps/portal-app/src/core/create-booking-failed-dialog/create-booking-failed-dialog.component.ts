import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-create-booking-failed-dialog',
  imports: [
    TranslatePipe,
    MatDialogModule,
    MatButtonModule
  ],
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
