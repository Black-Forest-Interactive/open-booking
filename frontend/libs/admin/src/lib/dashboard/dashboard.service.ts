import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {DailyOffersFilterRequest} from "./dashboard.api";
import {OfferEntry, WeekSummary} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor() {
    super('admin/dashboard')
  }

  getSummary(): Observable<WeekSummary[]> {
    return this.get('summary')
  }

  getOfferEntries(day: string, request: DailyOffersFilterRequest): Observable<OfferEntry[]> {
    return this.post('offer/' + day, request)
  }

}
