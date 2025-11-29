import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared"
import {Observable} from "rxjs";
import {DashboardEntry, DateRangeSelectionRequest} from "./dashboard.api";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor() {
    super('day/info')
  }

  getDefaultDayInfo(): Observable<DashboardEntry[]> {
    return super.get('')
  }

  selectDayInfo(request: DateRangeSelectionRequest): Observable<DashboardEntry[]> {
    return super.post('', request)
  }

  loadDayInfo(date: string): Observable<DashboardEntry> {
    return super.get('' + date)
  }
}
