import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuditBoardComponent} from "./audit-board/audit-board.component";
import {AuditLogEntryDetailsComponent} from "./audit-log-entry-details/audit-log-entry-details.component";

const routes: Routes = [
  {path: '', component: AuditBoardComponent},
  {path: 'details/:id', component: AuditLogEntryDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule {
}
