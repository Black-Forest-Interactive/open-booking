import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./visitor.component').then(m => m.VisitorComponent)
  },
  {
    path: 'map',
    loadComponent: () => import('./visitor-map/visitor-map.component').then(m => m.VisitorMapComponent)
  },
];
