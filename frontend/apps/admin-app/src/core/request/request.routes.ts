import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./request.component').then(m => m.RequestComponent)
  },
];
