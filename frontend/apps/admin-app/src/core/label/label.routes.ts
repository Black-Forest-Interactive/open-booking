import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./label.component').then(m => m.LabelComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./label-change/label-change.component').then(m => m.LabelChangeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./label-change/label-change.component').then(m => m.LabelChangeComponent)
  },
];
