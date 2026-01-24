import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {DaySummary, OfferSearchEntry, OfferSearchRequest, WeekSummary} from "@open-booking/core";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor() {
    super('admin/dashboard')
  }

  getWeeksSummary(): Observable<WeekSummary[]> {
    return this.get('summary/week')
  }

  getDaySummary(from: string, to: string): Observable<DaySummary[]> {
    let params = new HttpParams()
      .set("from", from)
      .set("to", to)
    return this.get('summary/day', params)
  }

  getOfferEntries(request: OfferSearchRequest): Observable<OfferSearchEntry[]> {
    return this.post('offer', request)
  }

}
