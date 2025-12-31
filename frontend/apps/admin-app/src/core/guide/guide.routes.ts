import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./guide.component').then(m => m.GuideComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./guide-change/guide-change.component').then(m => m.GuideChangeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./guide-change/guide-change.component').then(m => m.GuideChangeComponent)
  },
];
