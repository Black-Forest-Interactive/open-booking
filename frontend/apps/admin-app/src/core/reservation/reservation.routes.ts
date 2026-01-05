import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./reservation.component').then(m => m.ReservationComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./reservation-create/reservation-create.component').then(m => m.ReservationCreateComponent)
  }
];
