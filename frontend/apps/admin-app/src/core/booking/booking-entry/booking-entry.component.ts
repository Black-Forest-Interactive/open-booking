import {Component, input} from '@angular/core';
import {DayInfo} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {HotToastService} from "@ngxpert/hot-toast";
import {ExportService} from "@open-booking/admin";

@Component({
  selector: 'app-booking-entry',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './booking-entry.component.html',
  styleUrl: './booking-entry.component.scss',
})
export class BookingEntryComponent {
  data = input.required<DayInfo>()

  constructor(private service: ExportService, private toast: HotToastService,) {
  }

  protected exportPdf() {
    let reference = this.toast.loading("Download started...")
    let date = this.data().date
    this.service.createDailyReportPdf(date)
      .subscribe({
          error: (e) => {
            reference.close()
            this.toast.error("Failed to generate PDF for " + date)
          },
          complete: () => reference.close()
        }
      )
  }

  protected exportExcel() {
    let reference = this.toast.loading("Download started...")
    let date = this.data().date
    this.service.createDailyReportExcel(date)
      .subscribe({
          error: (e) => {
            reference.close()
            this.toast.error("Failed to generate Excel for " + date)
          },
          complete: () => reference.close()
        }
      )
  }
}
