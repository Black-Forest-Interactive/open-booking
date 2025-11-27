import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminBoardComponent} from "./admin-board/admin-board.component";
import {AuthGuard} from "@auth0/auth0-angular";

const routes: Routes = [
  {
    path: '',
    component: AdminBoardComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
