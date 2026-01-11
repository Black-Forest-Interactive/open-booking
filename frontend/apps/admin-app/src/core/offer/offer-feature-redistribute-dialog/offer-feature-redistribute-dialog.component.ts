import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {OfferRedistributeComponent} from "../offer-redistribute/offer-redistribute.component";

@Component({
  selector: 'app-offer-feature-redistribute-dialog',
  imports: [MatDialogModule, OfferRedistributeComponent],
  templateUrl: './offer-feature-redistribute-dialog.component.html',
  styleUrl: './offer-feature-redistribute-dialog.component.scss',
})
export class OfferFeatureRedistributeDialogComponent {
  data = inject<string>(MAT_DIALOG_DATA)

  constructor(
    protected readonly dialogRef: MatDialogRef<OfferFeatureRedistributeDialogComponent>
  ) {
  }
}
