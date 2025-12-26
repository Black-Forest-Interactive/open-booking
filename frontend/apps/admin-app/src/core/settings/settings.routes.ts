import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./settings-change/settings-change.component').then(m => m.SettingsChangeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./settings-change/settings-change.component').then(m => m.SettingsChangeComponent)
  },
];
