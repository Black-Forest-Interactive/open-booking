import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {Page} from "../../../shared/page/page";
import {Setting, SettingChangeRequest} from "./settings-api";

@Injectable({
  providedIn: 'root'
})
export class SettingService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/settings', logging)
  }

  getAllSetting(page: number, size: number): Observable<Page<Setting>> {
    return this.getPaged('', page, size)
  }

  getSetting(id: number): Observable<Setting> {
    return this.get('' + id)
  }

  createSetting(request: SettingChangeRequest): Observable<Setting> {
    return this.post('', request)
  }

  updateSetting(id: number, request: SettingChangeRequest): Observable<Setting> {
    return this.put('' + id, request)
  }

  deleteSetting(id: number): Observable<Setting> {
    return this.delete('' + id)
  }
}
