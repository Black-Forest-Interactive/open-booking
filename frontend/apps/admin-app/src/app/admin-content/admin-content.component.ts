import {Component, signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {AppService} from "../app.service";
import {AdminMenuComponent} from "../admin-menu/admin-menu.component";

@Component({
  selector: 'app-admin-content',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    AdminMenuComponent
  ],
  templateUrl: './admin-content.component.html',
  styleUrl: './admin-content.component.scss',
})
export class AdminContentComponent {
  title = signal('ADMIN.Dashboard')

  constructor(protected readonly service: AppService) {
  }
}
