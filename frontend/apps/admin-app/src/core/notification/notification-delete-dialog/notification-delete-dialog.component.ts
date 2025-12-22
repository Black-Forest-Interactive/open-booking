import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NotificationTemplate} from "@open-booking/core";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-notification-delete-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './notification-delete-dialog.component.html',
  styleUrl: './notification-delete-dialog.component.scss',
})
export class NotificationDeleteDialogComponent {
  data = inject<NotificationTemplate>(MAT_DIALOG_DATA)

  constructor(
    private dialogRef: MatDialogRef<NotificationDeleteDialogComponent>
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close(false)
  }

  onYesClick() {
    this.dialogRef.close(true)
  }
}
