import {Component} from '@angular/core';
import {HotToastService} from "@ngneat/hot-toast";
import {DayInfoService} from "../../../day-info/model/day-info.service";

@Component({
  selector: 'app-booking-admin-board',
  templateUrl: './booking-admin-board.component.html',
  styleUrls: ['./booking-admin-board.component.scss']
})
export class BookingAdminBoardComponent {

  constructor(public dayInfoService: DayInfoService,private toast: HotToastService) {
  }

  ngOnInit(): void {
    this.dayInfoService.loadDefaultDayInfo()
  }

  create() {
    this.toast.error('Oh no BOOKING CREATE is not implemented yet');
  }

}
