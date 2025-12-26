import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {catchError, map, Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import * as FileSaver from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class ExportService extends BaseService {

  constructor() {
    super('admin/export')
  }

  createDailyReportPdf(date: string): Observable<boolean> {
    return this.getBlob('daily/' + date + '/pdf')
      .pipe(
        map(response => this.handleFileDownload(response)),
        catchError((err, caught) => {
          throw err
        })
      )
  }

  createDailyReportExcel(date: string): Observable<boolean> {
    return this.getBlob('daily/' + date + '/excel')
      .pipe(
        map(response => this.handleFileDownload(response)),
        catchError((err, caught) => {
          throw err
        })
      )
  }

  private handleFileDownload(response: HttpResponse<Blob>): boolean {
    let contentDispositionHeader = response.headers.get("content-disposition")
    // @ts-ignore
    let fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1].replace(/"/g, '')
    FileSaver.saveAs(response.body as Blob, fileName)
    return true
  }
}
