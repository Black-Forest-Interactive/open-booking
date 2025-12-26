import {Component} from '@angular/core';
import {DashboardSummaryComponent} from "./dashboard-summary/dashboard-summary.component";
import {DashboardFilterComponent} from "./dashboard-filter/dashboard-filter.component";
import {DashboardContentComponent} from "./dashboard-content/dashboard-content.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardSummaryComponent,
    DashboardFilterComponent,
    DashboardContentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

}
