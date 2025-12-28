import {Route} from '@angular/router';
import {DayInfoDetailsComponent} from "../core/day-info-details/day-info-details.component";
import {CreateBookingRequestComponent} from "../core/create-booking-request/create-booking-request.component";
import {ConfirmMailComponent} from "../core/confirm-mail/confirm-mail.component";

export const appRoutes: Route[] = [

  {
    path: '',
    loadComponent: () => import('../core/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'booking',
    loadComponent: () => import('../core/booking/booking.component').then(m => m.BookingComponent)
  },

  {path: 'details/:date', component: DayInfoDetailsComponent},
  {path: 'booking/:id', component: CreateBookingRequestComponent},
  {path: 'confirm/email/:key', component: ConfirmMailComponent}
];
