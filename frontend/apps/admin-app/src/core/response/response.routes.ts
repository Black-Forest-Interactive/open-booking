import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./response.component').then(m => m.ResponseComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./response-change/response-change.component').then(m => m.ResponseChangeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./response-change/response-change.component').then(m => m.ResponseChangeComponent)
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./response-details/response-details.component').then(m => m.ResponseDetailsComponent)
  }
];
