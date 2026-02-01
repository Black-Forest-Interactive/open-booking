import {BaseService} from "@open-booking/shared";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Statistics} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService extends BaseService {

  constructor() {
    super('admin/statistics')
  }

  getStatistics(): Observable<Statistics> {
    return this.get('')
  }
}
