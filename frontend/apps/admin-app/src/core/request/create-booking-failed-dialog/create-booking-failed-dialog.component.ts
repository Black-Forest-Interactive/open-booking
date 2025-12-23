import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-create-booking-failed-dialog',
  imports: [
    MatDialogModule,
    TranslatePipe,
    MatButtonModule
  ],
  templateUrl: './create-booking-failed-dialog.component.html',
  styleUrl: './create-booking-failed-dialog.component.scss',
})
export class CreateBookingFailedDialogComponent {
  data = inject<any>(MAT_DIALOG_DATA)

  constructor(
    private dialogRef: MatDialogRef<CreateBookingFailedDialogComponent>
  ) {
  }
}
