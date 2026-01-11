import {Component} from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {OfferCreateSeriesComponent} from "../offer-create-series/offer-create-series.component";

@Component({
  selector: 'app-offer-feature-create-series-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, OfferCreateSeriesComponent,],
  templateUrl: './offer-feature-create-series-dialog.component.html',
  styleUrl: './offer-feature-create-series-dialog.component.scss',
})
export class OfferFeatureCreateSeriesDialogComponent {
  constructor(
    protected readonly dialogRef: MatDialogRef<OfferFeatureCreateSeriesDialogComponent>
  ) {
  }
}
