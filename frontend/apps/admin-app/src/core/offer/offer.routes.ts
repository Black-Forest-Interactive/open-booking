import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./offer.component').then(m => m.OfferComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./offer-change/offer-change.component').then(m => m.OfferChangeComponent)
  },
  {
    path: 'create/series',
    loadComponent: () => import('./offer-create-series/offer-create-series.component').then(m => m.OfferCreateSeriesComponent)
  },
  {
    path: 'create/range',
    loadComponent: () => import('./offer-create-range/offer-create-range.component').then(m => m.OfferCreateRangeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./offer-change/offer-change.component').then(m => m.OfferChangeComponent)
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./offer-details/offer-details.component').then(m => m.OfferDetailsComponent)
  }
];



