import {Component, EventEmitter} from '@angular/core';
import {HotToastService} from "@ngneat/hot-toast";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Page} from "../../../shared/page/page";
import {AuditLogService} from "../model/audit-log.service";
import {AuditLogEntry} from '../model/audit-log-entry-api';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-audit-board',
  templateUrl: './audit-board.component.html',
  styleUrls: ['./audit-board.component.scss']
})
export class AuditBoardComponent {

  reloading: boolean = false
  pageNumber = 0
  pageSize = 25
  totalElements = 0

  data: AuditLogEntry[] = []

  displayedColumns: string[] = ['timestamp', 'user', 'level', 'message', 'source']

  keyUp: EventEmitter<string> = new EventEmitter<string>()

  constructor(
    private service: AuditLogService,
    private toastService: HotToastService
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

    this.service.getAllAuditLogEntry(number, this.pageSize).subscribe(p => this.handleData(p))
  }

  private handleData(p: Page<AuditLogEntry>) {
    this.data = p.content

    this.totalElements = p.totalSize
    this.pageNumber = p.pageable.number
    this.pageSize = p.pageable.size
    this.reloading = false
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
