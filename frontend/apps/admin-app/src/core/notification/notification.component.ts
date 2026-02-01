import {Component, computed, resource, signal} from '@angular/core';
import {NotificationService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {NotificationTemplate} from "@open-booking/core";
import {NotificationDeleteDialogComponent} from "./notification-delete-dialog/notification-delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MainContentComponent} from "../../shared/main-content/main-content.component";

@Component({
  selector: 'app-notification',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    LoadingBarComponent,
    TranslatePipe,
    RouterLink,
    MainContentComponent
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  displayedColumns: string[] = ['id', 'lang', 'type', 'subject', 'cmd']
  pageNumber = signal(0)
  pageSize = signal(25)

  private notificationCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize()
  }))

  private notificationResource = resource({
    params: this.notificationCriteria,
    loader: (param) => {
      return toPromise(this.service.getAllNotificationTemplate(param.params.page, param.params.size), param.abortSignal)
    }
  })

  private page = computed(() => this.notificationResource.value())
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.notificationResource.isLoading

  constructor(private service: NotificationService, private toast: HotToastService, private translateService: TranslateService, private dialog: MatDialog) {
  }


  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }

  search(query: string) {
    this.toast.error("Not implemented yet to search for '" + query + "'")
  }

  delete(template: NotificationTemplate) {
    let dialogRef = this.dialog.open(NotificationDeleteDialogComponent, {data: template})

    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) this.service.deleteNotificationTemplate(template.id).subscribe(() => this.handleDeleted(template))
    })
  }

  private handleDeleted(template: NotificationTemplate) {
    this.translateService.get("NOTIFICATION.Message.DeleteSuccess", template).subscribe(msg => this.toast.success(msg))
    this.pageNumber.set(0)
    this.notificationResource.reload()
  }
}
