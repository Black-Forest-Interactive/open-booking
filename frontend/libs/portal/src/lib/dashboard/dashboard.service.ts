import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared"
import {Observable} from "rxjs";
import {DashboardEntry} from "./dashboard.api";
import {DateRangeSelectionRequest, DayInfo} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor() {
    super('portal/dashboard')
  }

  selectDayInfo(request: DateRangeSelectionRequest): Observable<DashboardEntry[]> {
    return super.post('', request)
  }

  loadDayInfo(date: string): Observable<DayInfo> {
    return super.get('' + date)
  }
}
