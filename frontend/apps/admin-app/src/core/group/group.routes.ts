import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./group.component').then(m => m.GroupComponent)
  },
];
