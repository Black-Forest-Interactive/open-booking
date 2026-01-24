import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {ResolvedResponse} from "@open-booking/core";

@Component({
  selector: 'app-booking-success-dialog',
  imports: [
    TranslatePipe,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './booking-success-dialog.component.html',
  styleUrl: './booking-success-dialog.component.scss',
})
export class BookingSuccessDialogComponent {

  data = inject<ResolvedResponse>(MAT_DIALOG_DATA)

  title = this.data?.title ?? ''
  content = this.data?.content ?? ''

  constructor(
    public dialogRef: MatDialogRef<BookingSuccessDialogComponent>,
  ) {

  }
}
