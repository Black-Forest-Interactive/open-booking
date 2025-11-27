import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationTemplate} from "../model/notification-template-api";

@Component({
  selector: 'app-notification-template-delete-dialog',
  templateUrl: './notification-template-delete-dialog.component.html',
  styleUrls: ['./notification-template-delete-dialog.component.scss']
})
export class NotificationTemplateDeleteDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<NotificationTemplateDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationTemplate,
  ) {

  }

  onNoClick(): void {
    this.dialogRef.close(false)
  }

  onYesClick() {
    this.dialogRef.close(true)
  }

}
