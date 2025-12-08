import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {NotificationTemplate, NotificationTemplateChangeRequest} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService {

  constructor() {
    super('admin/notification')
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
