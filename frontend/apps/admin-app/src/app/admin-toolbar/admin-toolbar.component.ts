import {Component} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatToolbar} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {AppService} from "../app.service";
import {SettingsService} from "@open-booking/admin";
import {ThemeToggleButtonComponent} from "@open-booking/shared";

@Component({
  selector: 'app-admin-toolbar',
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatToolbar,
    RouterLink,
    TranslatePipe,
    MatMenuTrigger,
    ThemeToggleButtonComponent
  ],
  templateUrl: './admin-toolbar.component.html',
  styleUrl: './admin-toolbar.component.scss',
})
export class AdminToolbarComponent {
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
