import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {OfferSearchEntry, OfferSearchRequest, WeekSummary} from "@open-booking/core";

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

  getOfferEntries(request: OfferSearchRequest): Observable<OfferSearchEntry[]> {
    return this.post('offer', request)
  }

}
