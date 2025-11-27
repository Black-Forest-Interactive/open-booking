import {Component} from '@angular/core';
import {DayInfoService} from "../model/day-info.service";

@Component({
  selector: 'app-day-info-board-actions',
  templateUrl: './day-info-board-actions.component.html',
  styleUrls: ['./day-info-board-actions.component.scss']
})
export class DayInfoBoardActionsComponent {

  constructor(private service: DayInfoService) {
  }
}
