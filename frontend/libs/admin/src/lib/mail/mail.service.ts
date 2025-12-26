import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {MailJob, MailJobHistoryEntry} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class MailService extends BaseService {

  constructor() {
    super('admin/mail')
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
