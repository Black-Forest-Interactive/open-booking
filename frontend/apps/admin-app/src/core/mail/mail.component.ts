import {Component, computed, resource, signal} from '@angular/core';
import {LoadingBarComponent, SearchComponent, toPromise} from "@open-booking/shared";
import {MailService} from "@open-booking/admin";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {MatChipsModule} from "@angular/material/chips";
import {RouterLink} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {HotToastService} from "@ngxpert/hot-toast";

@Component({
  selector: 'app-mail',
  imports: [
    LoadingBarComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatInputModule,
    DatePipe,
    TranslatePipe,
    RouterLink,
    SearchComponent
  ],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss',
})
export class MailComponent {

  pageNumber = signal(0)
  pageSize = signal(25)

  private mailCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize()
  }))

  private mailResource = resource({
    params: this.mailCriteria,
    loader: (param) => {
      return toPromise(this.service.getJobs(param.params.page, param.params.size), param.abortSignal)
    }
  })

  private page = computed(() => this.mailResource.value())
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.mailResource.isLoading

  displayedColumns: string[] = ['timestamp', 'status', 'title', 'cmd']

  constructor(private service: MailService, private toast: HotToastService) {
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  protected search(data: string) {
    this.toast.error("Sorry searching '" + data + "' is not supported yet")
  }
}
