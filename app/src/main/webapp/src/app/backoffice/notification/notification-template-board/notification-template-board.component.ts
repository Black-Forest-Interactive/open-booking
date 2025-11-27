import {Component, EventEmitter} from '@angular/core';
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Page} from "../../../shared/page/page";
import {NotificationTemplateService} from "../model/notification-template.service";
import {NotificationTemplate} from "../model/notification-template-api";
import {NotificationTemplateDeleteDialogComponent} from "../notification-template-delete-dialog/notification-template-delete-dialog.component";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-notification-template-board',
  templateUrl: './notification-template-board.component.html',
  styleUrls: ['./notification-template-board.component.scss']
})
export class NotificationTemplateBoardComponent {

  reloading: boolean = false
  pageNumber = 0
  pageSize = 25
  totalElements = 0

  data: NotificationTemplate[] = []

  displayedColumns: string[] = ['id', 'lang', 'type', 'subject', 'cmd']

  keyUp: EventEmitter<string> = new EventEmitter<string>()

  constructor(
    private service: NotificationTemplateService,
    private toastService: HotToastService,
    private translateService: TranslateService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.loadPage(this.pageNumber)

    this.keyUp.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(data => this.search(data))
  }

  private loadPage(number: number) {
    if (this.reloading) return
    this.reloading = true

    this.service.getAllNotificationTemplate(number, this.pageSize).subscribe(p => this.handleData(p))
  }

  private handleData(p: Page<NotificationTemplate>) {
    this.data = p.content

    this.totalElements = p.totalSize
    this.pageNumber = p.pageable.number
    this.pageSize = p.pageable.size
    this.reloading = false
  }


  delete(template: NotificationTemplate) {
    let dialogRef = this.dialog.open(NotificationTemplateDeleteDialogComponent, {data: template})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.deleteNotificationTemplate(template.id).subscribe(() => this.handleDeleted(template))
    });
  }

  private handleDeleted(template: NotificationTemplate) {
    this.translateService.get("NOTIFICATION.Message.DeleteSuccess", template).subscribe(msg => this.toastService.success(msg))
    this.loadPage(0)
  }


  search(query: string) {
    this.toastService.error("Not implemented yet to search for '" + query + "'")
  }

  handlePageChange(event: PageEvent) {
    if (this.reloading) return
    this.pageSize = event.pageSize
    this.loadPage(event.pageIndex)
  }
}
