import {Route} from '@angular/router';
import {DayInfoDetailsComponent} from "../core/day-info-details/day-info-details.component";

export const appRoutes: Route[] = [

  {
    path: '',
    loadComponent: () => import('../core/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('../core/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: 'confirm/email/:key',
    loadComponent: () => import('../core/confirm-mail/confirm-mail.component').then(m => m.ConfirmMailComponent)
  },

  {path: 'details/:date', component: DayInfoDetailsComponent},
];
