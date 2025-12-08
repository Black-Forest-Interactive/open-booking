import {Route} from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () => import('../core/dashboard/dashboard.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'offer',
    loadChildren: () => import('../core/offer/offer.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'booking',
    loadChildren: () => import('../core/booking/booking.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'request',
    loadChildren: () => import('../core/request/request.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'search',
    loadChildren: () => import('../core/search/search.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'response',
    loadChildren: () => import('../core/response/response.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'notification',
    loadChildren: () => import('../core/notification/notification.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'audit',
    loadChildren: () => import('../core/audit/audit.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'cache',
    loadChildren: () => import('../core/cache/cache.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'settings',
    loadChildren: () => import('../core/settings/settings.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'mail',
    loadChildren: () => import('../core/mail/mail.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'group',
    loadChildren: () => import('../core/group/group.routes').then(m => m.routes),
    // canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  }
];
