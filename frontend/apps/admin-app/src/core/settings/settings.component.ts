import {Component, computed, resource, signal} from '@angular/core';
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {SettingsService} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";

import {TranslatePipe} from "@ngx-translate/core";
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {HotToastService} from "@ngxpert/hot-toast";
import {MatIconButton} from "@angular/material/button";
import {MainContentComponent} from "../../shared/main-content/main-content.component";

@Component({
  selector: 'app-settings',
  imports: [
    TranslatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    LoadingBarComponent,
    RouterLink,
    MatIconButton,
    MainContentComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  displayedColumns: string[] = ['id', 'key', 'value', 'type', 'cmd']
  pageNumber = signal(0)
  pageSize = signal(25)

  private settingsCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize()
  }))

  private settingsResource = resource({
    params: this.settingsCriteria,
    loader: (param) => {
      return toPromise(this.service.getAllSetting(param.params.page, param.params.size), param.abortSignal)
    }
  })

  private page = computed(() => this.settingsResource.value())
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.settingsResource.isLoading

  constructor(private service: SettingsService, private toast: HotToastService) {
  }

  search(query: string) {
    this.toast.error("Not implemented yet to search for '" + query + "'")
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }
}
