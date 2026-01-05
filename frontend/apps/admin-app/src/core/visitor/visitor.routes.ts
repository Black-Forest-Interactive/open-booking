import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visitor.component').then(m => m.VisitorComponent)
  },
];
