import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./statistics.component').then(m => m.StatisticsComponent)
  }
];
