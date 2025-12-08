import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./offer.component').then(m => m.OfferComponent)
  },
];
