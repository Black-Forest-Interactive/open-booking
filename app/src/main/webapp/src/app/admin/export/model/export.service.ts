import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import * as FileSaver from "file-saver";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ExportService extends BaseService {

  reloading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/export', logging)
  }

  createDailyReportPdf(date: string): Observable<boolean> {
    if (this.reloading.value) return of(false)
    this.reloading.next(true)
    return this.getBlob('daily/' + date + '/pdf')
      .pipe(
        map(response => this.handleFileDownload(response)),
        catchError((err, caught) => {
          this.reloading.next(false)
          throw err
        })
      )
  }

  createDailyReportExcel(date: string): Observable<boolean> {
    if (this.reloading.value) return of(false)
    this.reloading.next(true)
    return this.getBlob('daily/' + date + '/excel')
      .pipe(
        map(response => this.handleFileDownload(response)),
        catchError((err, caught) => {
          this.reloading.next(false)
          throw err
        })
      )
  }

  private handleFileDownload(response: HttpResponse<Blob>): boolean {
    let contentDispositionHeader = response.headers.get("content-disposition")
    // @ts-ignore
    let fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '')
    FileSaver.saveAs(response.body as Blob, fileName)
    this.reloading.next(false)
    return true
  }
}
