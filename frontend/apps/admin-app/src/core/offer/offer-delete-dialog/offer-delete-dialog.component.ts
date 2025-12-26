import {Component, inject} from '@angular/core';
import {Offer} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-offer-delete-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './offer-delete-dialog.component.html',
  styleUrl: './offer-delete-dialog.component.scss',
})
export class OfferDeleteDialogComponent {
  data = inject<Offer>(MAT_DIALOG_DATA)

  constructor(
    private dialogRef: MatDialogRef<OfferDeleteDialogComponent>
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close(false)
  }

  onYesClick() {
    this.dialogRef.close(true)
  }
}
