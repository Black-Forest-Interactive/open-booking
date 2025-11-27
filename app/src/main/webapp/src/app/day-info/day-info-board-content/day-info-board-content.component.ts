import {Component, OnInit} from '@angular/core';
import {DayInfoService} from "../model/day-info.service";

@Component({
  selector: 'app-day-info-board-content',
  templateUrl: './day-info-board-content.component.html',
  styleUrls: ['./day-info-board-content.component.scss']
})
export class DayInfoBoardContentComponent implements OnInit{

  constructor(public service: DayInfoService) {
  }

  ngOnInit(): void {
    this.service.loadDefaultDayInfo()
  }

}
