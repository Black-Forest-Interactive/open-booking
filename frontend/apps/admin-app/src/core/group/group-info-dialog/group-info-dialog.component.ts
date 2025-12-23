import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {GroupInfoComponent} from "../group-info/group-info.component";
import {TranslatePipe} from "@ngx-translate/core";
import {VisitorGroup} from "@open-booking/core";

@Component({
  selector: 'app-group-info-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    GroupInfoComponent,
    TranslatePipe
  ],
  templateUrl: './group-info-dialog.component.html',
  styleUrl: './group-info-dialog.component.scss',
})
export class GroupInfoDialogComponent {
  data = inject<VisitorGroup>(MAT_DIALOG_DATA)

  constructor(
    private dialogRef: MatDialogRef<GroupInfoDialogComponent>
  ) {
  }

  onCloseClick() {
    this.dialogRef.close()
  }
}
