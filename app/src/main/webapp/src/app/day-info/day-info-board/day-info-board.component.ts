import {Component} from '@angular/core';
import {DayInfoService} from "../model/day-info.service";

@Component({
  selector: 'app-day-info-board',
  templateUrl: './day-info-board.component.html',
  styleUrls: ['./day-info-board.component.scss']
})
export class DayInfoBoardComponent {

  constructor(private service: DayInfoService) {
  }

}
