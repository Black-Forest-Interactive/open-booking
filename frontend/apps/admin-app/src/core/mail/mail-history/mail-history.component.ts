import {Component, computed, inject, resource, signal} from '@angular/core';
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MailService} from "@open-booking/admin";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {LoadingBarComponent, SearchComponent, toPromise} from "@open-booking/shared";
import {navigateToMail} from "../../../app/app.routes";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {HotToastService} from "@ngxpert/hot-toast";

@Component({
  selector: 'app-mail-history',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    TranslatePipe,
    DatePipe,
    LoadingBarComponent,
    SearchComponent
  ],
  templateUrl: './mail-history.component.html',
  styleUrl: './mail-history.component.scss',
})
export class MailHistoryComponent {
  private route = inject(ActivatedRoute)
  jobId = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))), {initialValue: 0})

  pageNumber = signal(0)
  pageSize = signal(25)

  private mailHistoryCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize(),
    jobId: this.jobId()
  }))

  private mailHistoryResource = resource({
    params: this.mailHistoryCriteria,
    loader: (param) => {
      return toPromise(this.service.getJobHistory(param.params.jobId, param.params.page, param.params.size), param.abortSignal)
    }
  })

  private page = computed(() => this.mailHistoryResource.value())
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.mailHistoryResource.isLoading

  displayedColumns: string[] = ['timestamp', 'message']

  constructor(
    private service: MailService,
    private toast: HotToastService,
    private router: Router,
  ) {
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  protected search(data: string) {
    this.toast.error("Sorry searching '" + data + "' is not supported yet")
  }

  back() {
    navigateToMail(this.router)
  }
}
