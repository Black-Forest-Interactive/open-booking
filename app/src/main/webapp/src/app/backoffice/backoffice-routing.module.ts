import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BackofficeComponent} from "./backoffice/backoffice.component";

const routes: Routes = [
    {
      path: '',
      component: BackofficeComponent, children: [
        {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
        {path: 'offer', loadChildren: () => import('./offer/offer.module').then(m => m.OfferModule)},
        {path: 'booking', loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule)},
        {path: 'request', loadChildren: () => import('./request/request.module').then(m => m.RequestModule)},
        {path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule)},

        {path: 'response', loadChildren: () => import('./response/response.module').then(m => m.ResponseModule)},
        {path: 'notification', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule)},
        {path: 'audit', loadChildren: () => import('./audit/audit.module').then(m => m.AuditModule)},
        {path: 'cache', loadChildren: () => import('./cache/cache.module').then(m => m.CacheModule)},
        {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
        {path: 'mail', loadChildren: () => import('./mail/mail.module').then(m => m.MailModule)},
        {path: 'group', loadChildren: () => import('./visitor-group/visitor-group.module').then(m => m.VisitorGroupModule)},
      ]
    }
  ]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule {
}
