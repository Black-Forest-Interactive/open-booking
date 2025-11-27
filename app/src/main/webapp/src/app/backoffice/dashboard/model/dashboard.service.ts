import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {DailyVisitorStats} from "./dashboard-api";

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/dashboard', logging)
  }

  getDailyVisitorStats(): Observable<DailyVisitorStats[]>{
   return this.get('visitor/daily')
  }
}
