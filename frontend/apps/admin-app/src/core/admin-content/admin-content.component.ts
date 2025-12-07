import {Component, signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatDivider} from "@angular/material/list";
import {AppService} from "../../app/app.service";

@Component({
  selector: 'app-admin-content',
  imports: [
    CommonModule,
    TranslatePipe,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDivider
  ],
  templateUrl: './admin-content.component.html',
  styleUrl: './admin-content.component.scss',
})
export class AdminContentComponent {
  title = signal('ADMIN.Dashboard')

  constructor(protected readonly service: AppService) {
  }
}
