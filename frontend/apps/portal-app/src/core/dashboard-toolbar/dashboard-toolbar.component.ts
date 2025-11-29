import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {TranslatePipe} from "@ngx-translate/core";
import {AppService} from "../../app/app.service";
import {SettingsService} from "@open-booking/portal"
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dashboard-toolbar',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './dashboard-toolbar.component.html',
  styleUrl: './dashboard-toolbar.component.scss',
})
export class DashboardToolbarComponent {
  constructor(
    protected readonly service: AppService,
    protected readonly settingsService: SettingsService
  ) {
  }

  showHelp() {
    let newTab = window.open()
    if (newTab) this.settingsService.getHelpUrl().subscribe(url => newTab.location.href = url.url)
  }

}
