import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeBoardComponent} from "./home-board/home-board.component";
import {DayInfoDashboardComponent} from "./day-info-dashboard/day-info-dashboard.component";
import {DayInfoDetailsComponent} from "./day-info-details/day-info-details.component";
import {CreateBookingRequestComponent} from "./create-booking-request/create-booking-request.component";
import {ConfirmMailComponent} from "./confirm-mail/confirm-mail.component";


const routes: Routes = [
  {
    path: '',
    component: HomeBoardComponent,
    children: [
      {path: '', component: DayInfoDashboardComponent},
      {path: 'details/:date', component: DayInfoDetailsComponent},
      {path: 'booking/:id', component: CreateBookingRequestComponent},
      {path: 'confirm/email/:key', component: ConfirmMailComponent}
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
