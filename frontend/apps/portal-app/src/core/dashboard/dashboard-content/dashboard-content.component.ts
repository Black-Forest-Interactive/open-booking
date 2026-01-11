import {Component, input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DashboardContentEntryComponent} from "../dashboard-content-entry/dashboard-content-entry.component";
import {DayInfo} from "@open-booking/core";

@Component({
  selector: 'app-dashboard-content',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    DashboardContentEntryComponent
  ],
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
})
export class DashboardContentComponent {
  content = input.required<DayInfo[]>()
}
