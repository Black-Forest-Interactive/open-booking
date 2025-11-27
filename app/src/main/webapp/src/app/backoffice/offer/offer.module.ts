import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OfferRoutingModule} from './offer-routing.module';
import {OfferBoardComponent} from './offer-board/offer-board.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {OfferChangeComponent} from './offer-change/offer-change.component';
import {OfferDeleteDialogComponent} from './offer-delete-dialog/offer-delete-dialog.component';
import {OfferDetailsComponent} from './offer-details/offer-details.component';
import {OfferCreateSeriesComponent} from './offer-create-series/offer-create-series.component';
import {OfferCreateRangeComponent} from './offer-create-range/offer-create-range.component';


@NgModule({
  declarations: [
    OfferBoardComponent,
    OfferChangeComponent,
    OfferDeleteDialogComponent,
    OfferDetailsComponent,
    OfferCreateSeriesComponent,
    OfferCreateRangeComponent
  ],
  imports: [
    CommonModule,
    OfferRoutingModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
  ]
})
export class OfferModule { }
