import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OfferBoardComponent} from "./offer-board/offer-board.component";
import {OfferDetailsComponent} from "./offer-details/offer-details.component";
import {OfferChangeComponent} from "./offer-change/offer-change.component";
import {OfferCreateSeriesComponent} from "./offer-create-series/offer-create-series.component";
import {OfferCreateRangeComponent} from './offer-create-range/offer-create-range.component';

const routes: Routes = [
  {path: '', component: OfferBoardComponent},
  {path: 'create', component: OfferChangeComponent},
  {path: 'create/series', component: OfferCreateSeriesComponent},
  {path: 'create/range', component: OfferCreateRangeComponent},
  {path: 'edit/:id', component: OfferChangeComponent},
  {path: 'details/:id', component: OfferDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferRoutingModule {
}
