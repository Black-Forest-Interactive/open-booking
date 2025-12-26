import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./notification.component').then(m => m.NotificationComponent)
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./notification-details/notification-details.component').then(m => m.NotificationDetailsComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./notification-change/notification-change.component').then(m => m.NotificationChangeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./notification-change/notification-change.component').then(m => m.NotificationChangeComponent)
  },
];
