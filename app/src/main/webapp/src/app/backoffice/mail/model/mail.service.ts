import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {MailJob, MailJobHistoryEntry} from "./mail-api";
import {Observable} from "rxjs";
import {Page} from "../../../shared/page/page";

@Injectable({
  providedIn: 'root'
})
export class MailService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/mail', logging)
  }

  getJobs(page: number, size: number): Observable<Page<MailJob>> {
    return this.getPaged('', page, size)
  }

  getFailedJobs(page: number, size: number): Observable<Page<MailJob>> {
    return this.getPaged('failed', page, size)
  }

  getJobHistory(jobId: number, page: number, size: number): Observable<Page<MailJobHistoryEntry>> {
    return this.getPaged(jobId + '/history', page, size)
  }

  reRunJob(jobId: number): Observable<any> {
    return this.post(jobId + '', {})
  }


}
