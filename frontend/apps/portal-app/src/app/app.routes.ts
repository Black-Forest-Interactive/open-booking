import {Route} from '@angular/router';
import {DashboardComponent} from "../core/dashboard/dashboard.component";

export const appRoutes: Route[] = [
  {path: '', component: DashboardComponent},
  // {path: 'details/:date', component: DayInfoDetailsComponent},
  // {path: 'booking/:id', component: CreateBookingRequestComponent},
  // {path: 'confirm/email/:key', component: ConfirmMailComponent}
];
