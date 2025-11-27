import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {CacheInfo} from "./cache-api";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CacheService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/cache', logging)
  }

  getCacheInfo(key: string): Observable<CacheInfo> {
    return this.get('' + key)
  }

  getAllCacheInfos(): Observable<CacheInfo[]> {
    return this.get('')
  }

  resetCache(key: string): Observable<CacheInfo> {
    return this.delete('' + key)
  }

  resetAllCaches(): Observable<CacheInfo[]> {
    return this.delete('')
  }

}
