import {Route, Router} from '@angular/router';
import {canActivateAuthRole} from "@open-booking/shared";
import {
  PERMISSION_AUDIT_ADMIN,
  PERMISSION_BOOKING_ADMIN,
  PERMISSION_CACHE_ADMIN,
  PERMISSION_DASHBOARD_ADMIN,
  PERMISSION_GROUP_ADMIN,
  PERMISSION_MAIL_ADMIN,
  PERMISSION_NOTIFICATION_ADMIN,
  PERMISSION_OFFER_ADMIN,
  PERMISSION_REQUEST_ADMIN,
  PERMISSION_RESPONSE_ADMIN,
  PERMISSION_SETTINGS_ADMIN
} from "@open-booking/admin";

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () => import('../core/dashboard/dashboard.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_DASHBOARD_ADMIN]}
  },
  {
    path: 'offer',
    loadChildren: () => import('../core/offer/offer.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_OFFER_ADMIN]}
  },
  {
    path: 'booking',
    loadChildren: () => import('../core/booking/booking.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_BOOKING_ADMIN]}
  },
  {
    path: 'request',
    loadChildren: () => import('../core/request/request.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_REQUEST_ADMIN]}
  },
  {
    path: 'search',
    loadChildren: () => import('../core/search/search.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    // data: {roles: [Roles.ACCOUNT_READ]}
  },
  {
    path: 'response',
    loadChildren: () => import('../core/response/response.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_RESPONSE_ADMIN]}
  },
  {
    path: 'notification',
    loadChildren: () => import('../core/notification/notification.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_NOTIFICATION_ADMIN]}
  },
  {
    path: 'audit',
    loadChildren: () => import('../core/audit/audit.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_AUDIT_ADMIN]}
  },
  {
    path: 'cache',
    loadChildren: () => import('../core/cache/cache.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_CACHE_ADMIN]}
  },
  {
    path: 'settings',
    loadChildren: () => import('../core/settings/settings.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_SETTINGS_ADMIN]}
  },
  {
    path: 'mail',
    loadChildren: () => import('../core/mail/mail.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_MAIL_ADMIN]}
  },
  {
    path: 'group',
    loadChildren: () => import('../core/group/group.routes').then(m => m.routes),
    canActivate: [canActivateAuthRole],
    data: {roles: [PERMISSION_GROUP_ADMIN]}
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./forbidden/forbidden.component').then(m => m.ForbiddenComponent)
  }
];

export function navigateToOffer(router: Router) {
  router.navigate(['offer']).then()
}

export function navigateToBooking(router: Router) {
  router.navigate(['booking']).then()
}

export function navigateToRequest(router: Router) {
  router.navigate(['request']).then()
}

export function navigateToMail(router: Router) {
  router.navigate(['mail']).then()
}

export function navigateToGroup(router: Router) {
  router.navigate(['group']).then()
}
