import {Component} from '@angular/core';
import {MatChipListboxChange} from '@angular/material/chips';
import {DayInfoService} from "../model/day-info.service";
import {OfferSelectionEntry} from "../model/day-info-api";
import {Router} from '@angular/router';
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-day-info-booking-selection',
  templateUrl: './day-info-booking-selection.component.html',
  styleUrls: ['./day-info-booking-selection.component.scss']
})
export class DayInfoBookingSelectionComponent {

  constructor(public service: DayInfoService,
              private router: Router,
              private toastService: HotToastService,
              private translate: TranslateService
  ) {
  }

  handleSelectionChange(event: MatChipListboxChange) {
    this.service.changePrimarySelected(event.value as OfferSelectionEntry)
  }

  createBooking() {
    if (this.service.selected.length <= 0) {
      this.toastService.error(this.translate.instant("ERROR.NoDaySelectedForBooking"))
      return
    }
    this.router.navigate(['/home/booking/create']).then()
  }

  removeSelectedItem(s: OfferSelectionEntry) {
    this.service.removeSelected(s)
  }
}
