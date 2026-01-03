import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-reservation-failed-dialog',
  imports: [
    TranslatePipe,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './reservation-failed-dialog.component.html',
  styleUrl: './reservation-failed-dialog.component.scss',
})
export class ReservationFailedDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReservationFailedDialogComponent>,
  ) {
    console.log(data)
  }
}
