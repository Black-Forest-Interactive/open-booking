import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {Setting, SettingChangeRequest, TextResponse, UrlResponse} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService {

  constructor() {
    super('portal/settings')
  }

  getHelpUrl(): Observable<UrlResponse> {
    return this.get('help')
  }

  getTitle(): Observable<TextResponse> {
    return this.get('title')
  }

  getTermsAndConditionsUrl(): Observable<UrlResponse> {
    return this.get('terms-and-conditions')
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
