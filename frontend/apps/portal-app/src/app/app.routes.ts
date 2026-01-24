import {Route} from '@angular/router';

export const appRoutes: Route[] = [

  {
    path: '',
    loadComponent: () => import('../core/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'confirm/email/:key',
    loadComponent: () => import('../core/confirm-mail/confirm-mail.component').then(m => m.ConfirmMailComponent)
  },
  {
    path: 'details/:date',
    loadComponent: () => import('../core/day-info-details/day-info-details.component').then(m => m.DayInfoDetailsComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('../core/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'booking/:key',
    loadComponent: () => import('../core/booking/booking-details/booking-details.component').then(m => m.BookingDetailsComponent)
  },
];
