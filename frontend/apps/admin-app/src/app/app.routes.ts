import {Route} from '@angular/router';
import {DashboardComponent} from "../core/dashboard/dashboard.component";
import {SettingsComponent} from "../core/settings/settings.component";
import {BookingsComponent} from "../core/bookings/bookings.component";
import {UsersComponent} from "../core/users/users.component";

export const appRoutes: Route[] = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'users', component: UsersComponent},
  {path: 'bookings', component: BookingsComponent},
  {path: 'settings', component: SettingsComponent},
];
