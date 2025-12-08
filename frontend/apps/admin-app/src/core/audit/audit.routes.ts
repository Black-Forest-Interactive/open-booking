import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./audit.component').then(m => m.AuditComponent)
  },
];
