import {Component, inject} from '@angular/core';
import {GenericRequestResult} from "@open-booking/shared";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'lib-generic-result-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './generic-result-dialog.component.html',
  styleUrl: './generic-result-dialog.component.scss',
})
export class GenericResultDialogComponent {
  data = inject<GenericRequestResult>(MAT_DIALOG_DATA)

  success = this.data.success
  msg = this.data.msg

  constructor(public dialogRef: MatDialogRef<GenericResultDialogComponent>) {

  }

  onClose(): void {
    this.dialogRef.close();
  }
}
