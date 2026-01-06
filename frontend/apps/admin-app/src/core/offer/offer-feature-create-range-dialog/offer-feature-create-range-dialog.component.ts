import {Component} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {OfferCreateRangeComponent} from "../offer-create-range/offer-create-range.component";

@Component({
  selector: 'app-offer-feature-create-range-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, OfferCreateRangeComponent],
  templateUrl: './offer-feature-create-range-dialog.component.html',
  styleUrl: './offer-feature-create-range-dialog.component.scss',
})
export class OfferFeatureCreateRangeDialogComponent {
  constructor(
    protected readonly dialogRef: MatDialogRef<OfferFeatureCreateRangeDialogComponent>
  ) {
  }
}
