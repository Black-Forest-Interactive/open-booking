import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {AuditLogEntry} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class AuditService extends BaseService {

  constructor() {
    super('admin/audit')
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
