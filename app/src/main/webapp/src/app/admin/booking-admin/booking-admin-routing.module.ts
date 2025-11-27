import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "@auth0/auth0-angular";
import {BookingAdminBoardComponent} from './booking-admin-board/booking-admin-board.component';

const routes: Routes = [
  {path: '', component: BookingAdminBoardComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingAdminRoutingModule {
}
