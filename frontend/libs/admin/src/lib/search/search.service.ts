import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {SearchOperatorInfo} from "@open-booking/core";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SearchService extends BaseService {

  constructor() {
    super('admin/search')
  }

  getInfo(key: string): Observable<SearchOperatorInfo> {
    return this.get('' + key)
  }

  getAllInfo(): Observable<SearchOperatorInfo[]> {
    return this.get('')
  }

  setup(key: string): Observable<SearchOperatorInfo> {
    return this.post('' + key, {})
  }


}
