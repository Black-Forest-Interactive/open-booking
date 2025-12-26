import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./staff.component').then(m => m.StaffComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./staff-change/staff-change.component').then(m => m.StaffChangeComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./staff-change/staff-change.component').then(m => m.StaffChangeComponent)
  },
];
