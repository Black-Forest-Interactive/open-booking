import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchBoardComponent} from "./search-board/search-board.component";

const routes: Routes = [
  {path: '', component: SearchBoardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule {
}
