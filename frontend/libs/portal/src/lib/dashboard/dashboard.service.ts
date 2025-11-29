import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared"
import {Observable} from "rxjs";
import {DateRangeSelectionRequest, DayInfo} from "./dashboard.api";

@Injectable({
  providedIn: 'root'
})
export class DayInfoService extends BaseService {

  constructor() {
    super('day/info')
  }

  getDefaultDayInfo(): Observable<DayInfo[]> {
    return super.get('')
  }

  selectDayInfo(request: DateRangeSelectionRequest): Observable<DayInfo[]> {
    return super.post('', request)
  }

  loadDayInfo(date: string): Observable<DayInfo> {
    return super.get('' + date)
  }
}
