import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotificationTemplateChangeComponent} from "./notification-template-change/notification-template-change.component";
import {NotificationTemplateDetailsComponent} from "./notification-template-details/notification-template-details.component";
import {NotificationTemplateBoardComponent} from "./notification-template-board/notification-template-board.component";

const routes: Routes = [
  {path: '', component: NotificationTemplateBoardComponent},
  {path: 'create', component: NotificationTemplateChangeComponent},
  {path: 'edit/:id', component: NotificationTemplateChangeComponent},
  {path: 'details/:id', component: NotificationTemplateDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule {
}
