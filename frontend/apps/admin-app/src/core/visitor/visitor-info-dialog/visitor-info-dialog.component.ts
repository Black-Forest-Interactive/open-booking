import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {VisitorInfoComponent} from "../visitor-info/visitor-info.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Visitor} from "@open-booking/core";

@Component({
  selector: 'app-visitor-info-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    VisitorInfoComponent,
    TranslatePipe
  ],
  templateUrl: './visitor-info-dialog.component.html',
  styleUrl: './visitor-info-dialog.component.scss',
})
export class VisitorInfoDialogComponent {
  data = inject<Visitor>(MAT_DIALOG_DATA)

  constructor(
    private dialogRef: MatDialogRef<VisitorInfoDialogComponent>
  ) {
  }

  onCloseClick() {
    this.dialogRef.close()
  }
}
