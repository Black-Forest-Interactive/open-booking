import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsBoardComponent} from "./settings-board/settings-board.component";
import {SettingChangeComponent} from "./setting-change/setting-change.component";

const routes: Routes = [
  {path: '', component: SettingsBoardComponent},
  {path: 'create', component: SettingChangeComponent},
  {path: 'edit/:id', component: SettingChangeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {


}
