import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VisitorGroup} from "../model/visitor-group-api";

@Component({
  selector: 'app-visitor-group-info-dialog',
  templateUrl: './visitor-group-info-dialog.component.html',
  styleUrls: ['./visitor-group-info-dialog.component.scss']
})
export class VisitorGroupInfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: VisitorGroup, public dialogRef: MatDialogRef<VisitorGroupInfoDialogComponent>) {
  }

  onCloseClick() {
    this.dialogRef.close()
  }
}
