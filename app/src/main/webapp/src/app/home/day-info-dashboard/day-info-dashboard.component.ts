import {Component} from '@angular/core';
import {DayInfoService} from "../../day-info/model/day-info.service";

@Component({
  selector: 'app-day-info-dashboard',
  templateUrl: './day-info-dashboard.component.html',
  styleUrls: ['./day-info-dashboard.component.scss']
})
export class DayInfoDashboardComponent {
  constructor(public service: DayInfoService) {
  }

  ngOnInit(): void {
    this.service.loadDefaultDayInfo()
  }
}
