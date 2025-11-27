import {Component, EventEmitter} from '@angular/core';
import {DayInfoService} from "../../../day-info/model/day-info.service";
import {HotToastService} from "@ngneat/hot-toast";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from "moment";


@Component({
  selector: 'app-booking-board',
  templateUrl: './booking-board.component.html',
  styleUrls: ['./booking-board.component.scss']
})
export class BookingBoardComponent {

  keyUp: EventEmitter<string> = new EventEmitter<string>()

  start = new FormControl<Date | null>(null, Validators.required)
  end = new FormControl<Date | null>(null, Validators.required)

  range = new FormGroup({
    start: this.start,
    end: this.end
  });

  constructor(public dayInfoService: DayInfoService, private toast: HotToastService, private router: Router, private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    let params = this.activatedRoute.snapshot.queryParams

    let from = params['from']
    if (from) this.start.setValue(moment(from).toDate())
    let to = params['to']
    if (to) this.end.setValue(moment(to).toDate())
    if (from && to) {
      this.handleSelectionChange()
    } else {
      this.dayInfoService.loadDefaultDayInfo()
    }
    this.range.valueChanges.subscribe(d => this.handleSelectionChange())
  }


  create() {
    this.toast.error('Oh no BOOKING CREATE is not implemented yet');
  }

  clearSelection() {
    this.range.get('start')?.setValue(null)
    this.range.get('end')?.setValue(null)
    this.range.reset()
    this.dayInfoService.loadDefaultDayInfo()
  }

  handleSelectionChange() {
    let start = this.range.get('start')?.value
    let end = this.range.get('end')?.value
    if (this.range.invalid) return
    if (start != null && end != null) {
      let from = moment(start).format("YYYY-MM-DD")
      let to = moment(end).format("YYYY-MM-DD")
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {from: from, to: to},
        queryParamsHandling: 'merge'
      }).then()
      this.dayInfoService.loadRangeDayInfoString(from, to)
    }
  }
}
