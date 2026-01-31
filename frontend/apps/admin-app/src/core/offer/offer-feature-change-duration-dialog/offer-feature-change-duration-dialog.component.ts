import {Component} from '@angular/core';
import {OfferChangeDurationComponent} from "../offer-change-duration/offer-change-duration.component";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-offer-feature-change-duration-dialog',
  imports: [
    MatDialogModule,
    OfferChangeDurationComponent
  ],
  templateUrl: './offer-feature-change-duration-dialog.component.html',
  styleUrl: './offer-feature-change-duration-dialog.component.scss',
})
export class OfferFeatureChangeDurationDialogComponent {
  constructor(
    protected readonly dialogRef: MatDialogRef<OfferFeatureChangeDurationDialogComponent>
  ) {
  }
}
