import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {DailyOffers, WeekSummary} from "./dashboard.api";

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

  getDailyOffers(day: string): Observable<DailyOffers> {
    return this.get('offer/' + day)
  }

}
