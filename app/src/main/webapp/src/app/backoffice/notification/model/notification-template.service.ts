import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {Page} from "../../../shared/page/page";
import {NotificationTemplate, NotificationTemplateChangeRequest} from "./notification-template-api";

@Injectable({
  providedIn: 'root'
})
export class NotificationTemplateService  extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/notification/template', logging)
  }

  getAllNotificationTemplate(page: number, size: number): Observable<Page<NotificationTemplate>> {
    return this.getPaged('', page, size)
  }

  getNotificationTemplate(id: number): Observable<NotificationTemplate> {
    return this.get('' + id)
  }

  createNotificationTemplate(request: NotificationTemplateChangeRequest): Observable<NotificationTemplate> {
    return this.post('', request)
  }

  updateNotificationTemplate(id: number, request: NotificationTemplateChangeRequest): Observable<NotificationTemplate> {
    return this.put('' + id, request)
  }

  deleteNotificationTemplate(id: number): Observable<NotificationTemplate> {
    return this.delete('' + id)
  }
}
