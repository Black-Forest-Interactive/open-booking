import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {Page} from "../../../shared/page/page";
import {VisitorGroup, VisitorGroupChangeRequest} from "./visitor-group-api";

@Injectable({
  providedIn: 'root'
})
export class VisitorGroupService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/group', logging)
  }

  getAllVisitorGroups(page: number, size: number): Observable<Page<VisitorGroup>> {
    return this.getPaged('', page, size)
  }

  getVisitorGroup(id: number): Observable<VisitorGroup> {
    return this.get('' + id)
  }

  createVisitorGroup(request: VisitorGroupChangeRequest): Observable<VisitorGroup> {
    return this.post('', request)
  }

  updateVisitorGroup(id: number, request: VisitorGroupChangeRequest): Observable<VisitorGroup> {
    return this.put('' + id, request)
  }

  deleteVisitorGroup(id: number): Observable<VisitorGroup> {
    return this.delete('' + id)
  }

  confirmVisitorGroup(id: number): Observable<VisitorGroup> {
    return this.put('' + id + '/confirm', {})
  }
}
