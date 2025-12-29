import {Route} from '@angular/router';
import {DayInfoDetailsComponent} from "../core/day-info-details/day-info-details.component";
import {CreateBookingRequestComponent} from "../core/create-booking-request/create-booking-request.component";

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
    path: 'booking/checkout',
    loadComponent: () => import('../core/booking/booking-checkout/booking-checkout.component').then(m => m.BookingCheckoutComponent)
  },
  {
    path: 'confirm/email/:key',
    loadComponent: () => import('../core/confirm-mail/confirm-mail.component').then(m => m.ConfirmMailComponent)
  },

  {path: 'details/:date', component: DayInfoDetailsComponent},
  {path: 'booking/:id', component: CreateBookingRequestComponent},
];
