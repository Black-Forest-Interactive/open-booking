import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {Page} from "../../../shared/page/page";
import {AuditLogEntry} from "./audit-log-entry-api";

@Injectable({
  providedIn: 'root'
})
export class AuditLogService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/audit', logging)
  }

  getAllAuditLogEntry(page: number, size: number): Observable<Page<AuditLogEntry>> {
    return this.getPaged('', page, size)
  }

  getAuditLogEntry(id: number): Observable<AuditLogEntry> {
    return this.get('' + id)
  }

  findAllAuditLogEntryByReferenceId(referenceId: number, page: number, size: number): Observable<Page<AuditLogEntry>> {
    return this.getPaged('find/' + referenceId, page, size)
  }
}
