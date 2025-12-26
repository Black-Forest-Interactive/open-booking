import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {Response} from "@open-booking/core"
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-response-delete-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './response-delete-dialog.component.html',
  styleUrl: './response-delete-dialog.component.scss',
})
export class ResponseDeleteDialogComponent {
  data = inject<Response>(MAT_DIALOG_DATA)

  constructor(
    private dialogRef: MatDialogRef<ResponseDeleteDialogComponent>
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close(false)
  }

  onYesClick() {
    this.dialogRef.close(true)
  }
}
