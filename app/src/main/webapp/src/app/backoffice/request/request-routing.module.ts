import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RequestBoardComponent} from "./request-board/request-board.component";
import {RequestCreateComponent} from "./request-create/request-create.component";

const routes: Routes = [
  {path: '', component: RequestBoardComponent},
  {path: 'create', component: RequestCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
