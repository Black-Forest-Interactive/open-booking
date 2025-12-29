import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-booking-failed-dialog',
  imports: [
    TranslatePipe,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './booking-failed-dialog.component.html',
  styleUrl: './booking-failed-dialog.component.scss',
})
export class BookingFailedDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BookingFailedDialogComponent>,
  ) {
    console.log(data)
  }
}
