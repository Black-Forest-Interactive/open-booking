import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking.component').then(m => m.BookingComponent)
  },
];
