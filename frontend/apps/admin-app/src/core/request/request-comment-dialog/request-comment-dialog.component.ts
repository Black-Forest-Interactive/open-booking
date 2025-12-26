import {Component, inject} from '@angular/core';
import {BookingRequestInfo} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-request-comment-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './request-comment-dialog.component.html',
  styleUrl: './request-comment-dialog.component.scss',
})
export class RequestCommentDialogComponent {
  data = inject<BookingRequestInfo>(MAT_DIALOG_DATA)

  constructor(
    private dialogRef: MatDialogRef<RequestCommentDialogComponent>
  ) {
  }

  onCloseClick() {
    this.dialogRef.close()
  }
}
