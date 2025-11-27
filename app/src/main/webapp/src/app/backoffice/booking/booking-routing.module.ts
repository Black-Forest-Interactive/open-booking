import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookingBoardComponent} from "./booking-board/booking-board.component";
import {BookingChangeComponent} from "./booking-change/booking-change.component";
import {BookingDetailsComponent} from "./booking-details/booking-details.component";
import {BookingDailyBoardComponent} from "./booking-daily-board/booking-daily-board.component";

const routes: Routes = [
  {path: '', component: BookingBoardComponent},
  {path: 'day/:date', component: BookingDailyBoardComponent},
  {path: 'details/:id', component: BookingDetailsComponent},
  {path: 'create', component: BookingChangeComponent},
  {path: 'edit/:id', component: BookingChangeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {
}
