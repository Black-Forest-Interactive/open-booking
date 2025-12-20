import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {DateRangeSelectionRequest, DayInfo} from "@open-booking/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InfoService extends BaseService {

  constructor() {
    super('admin/info')
  }

  getDayInfoRange(request: DateRangeSelectionRequest): Observable<DayInfo[]> {
    return super.post('day', request)
  }

  getDayInfo(date: string): Observable<DayInfo> {
    return super.get('day/' + date)
  }


}
