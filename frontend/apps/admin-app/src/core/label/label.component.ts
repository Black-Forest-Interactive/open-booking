import {Component, computed, resource, signal} from '@angular/core';
import {LabelService} from "@open-booking/admin";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {HotToastService} from "@ngxpert/hot-toast";
import {LoadingBarComponent, SearchComponent, toPromise} from "@open-booking/shared";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-label',
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    TranslatePipe,
    RouterLink,
    LoadingBarComponent,
    SearchComponent
  ],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
})
export class LabelComponent {
  displayedColumns: string[] = ['id', 'name', 'color', 'priority', 'cmd']
  pageNumber = signal(0)
  pageSize = signal(25)

  private guideCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize()
  }))

  private guideResource = resource({
    params: this.guideCriteria,
    loader: (param) => {
      return toPromise(this.service.getAllLabel(param.params.page, param.params.size), param.abortSignal)
    }
  })

  private page = computed(() => this.guideResource.value())
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.guideResource.isLoading

  constructor(private service: LabelService, private toast: HotToastService) {
  }

  search(query: string) {
    this.toast.error("Not implemented yet to search for '" + query + "'")
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }
}
