import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DayInfoService} from "../model/day-info.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";

@Component({
  selector: 'app-day-info-range-selection',
  templateUrl: './day-info-range-selection.component.html',
  styleUrls: ['./day-info-range-selection.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
})
export class DayInfoRangeSelectionComponent {

  range = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
  });

  constructor(private service: DayInfoService) {
    this.range.valueChanges.subscribe(d => this.handleSelectionChange())
  }

  handleSelectionChange() {
    let start = this.range.get('start')?.value
    let end = this.range.get('end')?.value

    console.log("Handle selection change" + start + " " + end)
    if (this.range.invalid) return
    if (start == null || end == null) {
      this.service.loadDefaultDayInfo()
    } else {
      this.service.loadRangeDayInfo(start, end)
    }
  }

  clearSelection() {
    this.range.get('start')?.setValue(null)
    this.range.get('end')?.setValue(null)
  }

  handleSelectionSubmit() {
    console.log("Submit")
  }

  handleSubmit() {
    console.log("Submit")
  }
}
