import {Component, input} from '@angular/core';
import {DashboardEntry} from "@open-booking/portal";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-dashboard-content',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    RouterLink,
    DatePipe
  ],
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
})
export class DashboardContentComponent {
  content = input.required<DashboardEntry[]>()
}
