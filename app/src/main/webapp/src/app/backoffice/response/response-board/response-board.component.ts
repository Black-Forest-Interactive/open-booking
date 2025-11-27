import {Component, EventEmitter} from '@angular/core';
import {ResponseService} from '../model/response.service';
import {Response} from "../model/response-api";
import {Page} from "../../../shared/page/page";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {HotToastService} from "@ngneat/hot-toast";
import {MatDialog} from "@angular/material/dialog";
import {ResponseDeleteDialogComponent} from "../response-delete-dialog/response-delete-dialog.component";
import {TranslateService} from "@ngx-translate/core";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-response-board',
  templateUrl: './response-board.component.html',
  styleUrls: ['./response-board.component.scss']
})
export class ResponseBoardComponent {

  reloading: boolean = false
  pageNumber = 0
  pageSize = 25
  totalElements = 0

  data: Response[] = []

  displayedColumns: string[] = ['id', 'lang', 'type', 'title', 'cmd']

  keyUp: EventEmitter<string> = new EventEmitter<string>()

  constructor(
    private service: ResponseService,
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

    this.service.getAllResponse(number, this.pageSize).subscribe(p => this.handleData(p))
  }

  private handleData(p: Page<Response>) {
    this.data = p.content

    this.totalElements = p.totalSize
    this.pageNumber = p.pageable.number
    this.pageSize = p.pageable.size
    this.reloading = false
  }


  delete(response: Response) {
    let dialogRef = this.dialog.open(ResponseDeleteDialogComponent, {data: response})

    dialogRef.afterClosed().subscribe((value) => {
      if (value)  this.service.deleteResponse(response.id).subscribe(() => this.handleDeleted(response))
    });
  }

  private handleDeleted(response: Response) {
    this.translateService.get("RESPONSE.Message.DeleteSuccess", response).subscribe(msg => this.toastService.success(msg))
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
