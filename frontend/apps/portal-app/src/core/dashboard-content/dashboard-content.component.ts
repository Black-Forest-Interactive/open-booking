import {Component, input} from '@angular/core';
import {DashboardEntry} from "@open-booking/portal";

@Component({
  selector: 'app-dashboard-content',
  imports: [],
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
})
export class DashboardContentComponent {
  content = input.required<DashboardEntry[]>()
}
