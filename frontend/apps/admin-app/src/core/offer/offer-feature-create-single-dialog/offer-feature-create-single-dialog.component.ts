import {Component} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {OfferCreateSingleComponent} from "../offer-create-single/offer-create-single.component";

@Component({
  selector: 'app-offer-feature-create-single-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, OfferCreateSingleComponent],
  templateUrl: './offer-feature-create-single-dialog.component.html',
  styleUrl: './offer-feature-create-single-dialog.component.scss',
})
export class OfferFeatureCreateSingleDialogComponent {
  constructor(
    protected readonly dialogRef: MatDialogRef<OfferFeatureCreateSingleDialogComponent>
  ) {
  }
}
