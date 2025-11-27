import {Component, Input} from '@angular/core';
import {DayInfoHelper, DayInfoOffer} from "../../offer/model/offer-api";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-day-info-details-list-entry',
  templateUrl: './day-info-details-list-entry.component.html',
  styleUrls: ['./day-info-details-list-entry.component.scss']
})
export class DayInfoDetailsListEntryComponent {


  @Input() set entry(value: DayInfoOffer) {
    this.spaceAvailable = DayInfoHelper.getSpaceAvailable(value)
    this._entry = value
  }

  get entry(): DayInfoOffer {
    return this._entry
  }

  // @ts-ignore
  private _entry: DayInfoOffer

  spaceAvailable: number = 0
  param: any

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.param = {value: DayInfoHelper.getSpaceAvailable(this.entry)}
  }


  select() {
    this.router.navigate(['home', 'booking', this.entry.offer.id]).then()
  }
}
