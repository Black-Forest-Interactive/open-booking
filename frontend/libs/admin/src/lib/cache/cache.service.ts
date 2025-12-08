import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {CacheInfo} from "@open-booking/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CacheService extends BaseService {

  constructor() {
    super('admin/cache')
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
