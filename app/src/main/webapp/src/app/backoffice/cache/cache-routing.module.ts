import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CacheBoardComponent} from "./cache-board/cache-board.component";

const routes: Routes = [
  {path: '', component: CacheBoardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CacheRoutingModule {
}
