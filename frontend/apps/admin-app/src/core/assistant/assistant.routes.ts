import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./assistant.component').then(m => m.AssistantComponent)
  }
];
