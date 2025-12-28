import {Component, computed, resource, signal} from '@angular/core';
import {DashboardToolbarComponent} from "../dashboard-toolbar/dashboard-toolbar.component";
import {DashboardContentComponent} from "../dashboard-content/dashboard-content.component";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {DashboardService} from "@open-booking/portal";
import {MatCard} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import packageJson from '../../../../../package.json';
import {DateRangeSelectionRequest} from "@open-booking/core";

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardToolbarComponent,
    DashboardContentComponent,
    LoadingBarComponent,
    MatCard,
    MatDivider,
    MatIcon,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  version = packageJson.version
  currentYear = new Date().getFullYear()

  from = signal('')
  to = signal('')

  request = computed(() => new DateRangeSelectionRequest(this.from(), this.to()))

  private entriesResource = resource({
    params: this.request,
    loader: (param) => {
      return toPromise(this.service.selectDayInfo(param.params), param.abortSignal)
    }
  })

  entries = computed(() => this.entriesResource.value() ?? [])
  reloading = this.entriesResource.isLoading

  constructor(private service: DashboardService) {
  }

}
