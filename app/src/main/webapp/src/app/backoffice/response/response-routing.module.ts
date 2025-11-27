import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResponseBoardComponent} from "./response-board/response-board.component";
import {ResponseChangeComponent} from "./response-change/response-change.component";
import {ResponseDetailsComponent} from "./response-details/response-details.component";

const routes: Routes = [
  {path: '', component: ResponseBoardComponent},
  {path: 'create', component: ResponseChangeComponent},
  {path: 'edit/:id', component: ResponseChangeComponent},
  {path: 'details/:id', component: ResponseDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponseRoutingModule {
}
