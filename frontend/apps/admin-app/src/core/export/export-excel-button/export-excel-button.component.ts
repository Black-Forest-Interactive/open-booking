import {Component, input} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {ExportService, PERMISSION_EXPORT_ADMIN} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {HasRolesDirective} from "keycloak-angular";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-export-excel-button',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    HasRolesDirective
  ],
  templateUrl: './export-excel-button.component.html',
  styleUrl: './export-excel-button.component.scss',
})
export class ExportExcelButtonComponent {

  selectedDay = input.required<string>()

  constructor(
    private exportService: ExportService,
    private toast: HotToastService
  ) {
  }

  protected exportExcel() {
    let reference = this.toast.loading("Download started...")
    this.exportService.createDailyReportExcel(this.selectedDay())
      .subscribe({
          error: (e) => {
            reference.close()
            this.toast.error("Failed to generate Excel for " + this.selectedDay())
          },
          complete: () => reference.close()
        }
      )
  }

  protected readonly PERMISSION_EXPORT_ADMIN = PERMISSION_EXPORT_ADMIN;
  protected readonly environment = environment;
}
