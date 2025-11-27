import {Component, Input} from '@angular/core';
import {DayInfo, defaultDayInfo} from "../../../day-info/model/day-info-api";
import {ExportService} from "../../../admin/export/model/export.service";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-day-info-card',
  templateUrl: './day-info-card.component.html',
  styleUrls: ['./day-info-card.component.scss']
})
export class DayInfoCardComponent {
  @Input() data: DayInfo = defaultDayInfo

  constructor(
    private exportService: ExportService,
    private toastService: HotToastService,

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

}
