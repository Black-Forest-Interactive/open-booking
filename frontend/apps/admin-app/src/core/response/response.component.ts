import {Component, computed, resource, signal} from '@angular/core';
import {ResponseService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {Response} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {ResponseDeleteDialogComponent} from "./response-delete-dialog/response-delete-dialog.component";
import {MainContentComponent} from "../../shared/main-content/main-content.component";

@Component({
  selector: 'app-response',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    TranslatePipe,
    RouterLink,
    MainContentComponent,
    LoadingBarComponent
  ],
  templateUrl: './response.component.html',
  styleUrl: './response.component.scss',
})
export class ResponseComponent {
  displayedColumns: string[] = ['id', 'lang', 'type', 'title', 'cmd']
  pageNumber = signal(0)
  pageSize = signal(25)

  private response = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize()
  }))

  private responseResource = resource({
    params: this.response,
    loader: (param) => {
      return toPromise(this.service.getAllResponse(param.params.page, param.params.size), param.abortSignal)
    }
  })

  private page = computed(() => this.responseResource.value())
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.responseResource.isLoading

  constructor(private service: ResponseService, private toast: HotToastService, private translate: TranslateService, private dialog: MatDialog) {
  }

  search(query: string) {
    this.toast.error("Not implemented yet to search for '" + query + "'")
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  protected delete(response: Response) {
    let dialogRef = this.dialog.open(ResponseDeleteDialogComponent, {data: response})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.deleteResponse(response.id).subscribe(() => this.responseResource.reload())
    })
  }
}
