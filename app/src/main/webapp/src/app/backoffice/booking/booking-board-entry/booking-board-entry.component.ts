import {Component, Input} from '@angular/core';
import {DayInfo, defaultDayInfo} from "../../../day-info/model/day-info-api";
import {ExportService} from "../../../admin/export/model/export.service";
import {HotToastService} from "@ngneat/hot-toast";
import {Router} from "@angular/router";

@Component({
  selector: 'app-booking-board-entry',
  templateUrl: './booking-board-entry.component.html',
  styleUrls: ['./booking-board-entry.component.scss']
})
export class BookingBoardEntryComponent {
  @Input() data: DayInfo = defaultDayInfo

  constructor(
    private exportService: ExportService,
    private toastService: HotToastService,
    private router: Router
  ) {
  }

  exportPdf(data: DayInfo) {
    let reference = this.toastService.loading("Download started...")
    this.exportService.createDailyReportPdf(data.date)
      .subscribe({
          error: (e) => {
            reference.close()
            this.toastService.error("Failed to generate PDF for " + data.date)
          },
          complete: () => reference.close()
        }
      )
  }

  exportExcel(data: DayInfo) {
    let reference = this.toastService.loading("Download started...")
    this.exportService.createDailyReportExcel(data.date)
      .subscribe({
          error: (e) => {
            reference.close()
            this.toastService.error("Failed to generate Excel for " + data.date)
          },
          complete: () => reference.close()
        }
      )
  }

  create(data: DayInfo) {

  }


}
