import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Response} from "../model/response-api";

@Component({
  selector: 'app-response-delete-dialog',
  templateUrl: './response-delete-dialog.component.html',
  styleUrls: ['./response-delete-dialog.component.scss']
})
export class ResponseDeleteDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<ResponseDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Response,
  ) {

  }

  onNoClick(): void {
    this.dialogRef.close(false)
  }

  onYesClick() {
    this.dialogRef.close(true)
  }


}
