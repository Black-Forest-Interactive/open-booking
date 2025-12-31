import {Component, computed, resource, signal} from '@angular/core';
import {GuideService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {LoadingBarComponent, SearchComponent, toPromise} from "@open-booking/shared";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-guide',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    RouterLink,
    TranslatePipe,
    LoadingBarComponent,
    SearchComponent
  ],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.scss',
})
export class GuideComponent {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'mobile', 'cmd']
  pageNumber = signal(0)
  pageSize = signal(25)

  private guideCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize()
  }))

  private guideResource = resource({
    params: this.guideCriteria,
    loader: (param) => {
      return toPromise(this.service.getAllGuide(param.params.page, param.params.size), param.abortSignal)
    }
  })

  private page = computed(() => this.guideResource.value())
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.guideResource.isLoading

  constructor(private service: GuideService, private toast: HotToastService) {
  }

  search(query: string) {
    this.toast.error("Not implemented yet to search for '" + query + "'")
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }
}
