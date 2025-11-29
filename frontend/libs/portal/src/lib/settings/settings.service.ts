import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {TextResponse, UrlResponse} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService {

  constructor() {
    super('setting')
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

}
