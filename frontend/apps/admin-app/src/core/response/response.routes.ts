import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./response.component').then(m => m.ResponseComponent)
  },
];
