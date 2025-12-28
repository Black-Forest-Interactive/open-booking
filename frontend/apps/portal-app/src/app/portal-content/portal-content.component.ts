import {Component, signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {AppService} from "../app.service";

@Component({
  selector: 'app-portal-content',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './portal-content.component.html',
  styleUrl: './portal-content.component.scss',
})
export class PortalContentComponent {
  title = signal('ADMIN.Dashboard')

  constructor(protected readonly service: AppService) {
  }
}
