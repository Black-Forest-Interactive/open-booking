import {Router, Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'day/:date',
    loadComponent: () => import('./booking-daily/booking-daily.component').then(m => m.BookingDailyComponent)
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./booking-details/booking-details.component').then(m => m.BookingDetailsComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./booking-change/booking-change.component').then(m => m.BookingChangeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./booking-change/booking-change.component').then(m => m.BookingChangeComponent)
  },
];

export function navigateToBookingDetails(router: Router, id: number) {
  router.navigate(['booking', 'details', id]).then()
}
