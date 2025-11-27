import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BookingRequestInfo} from "../model/booking-request-api";

@Component({
  selector: 'app-request-comment-dialog',
  templateUrl: './request-comment-dialog.component.html',
  styleUrls: ['./request-comment-dialog.component.scss']
})
export class RequestCommentDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BookingRequestInfo,
    public dialogRef: MatDialogRef<RequestCommentDialogComponent>
  ) {
  }

  onCloseClick() {
    this.dialogRef.close()
  }
}
