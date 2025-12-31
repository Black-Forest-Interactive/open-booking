import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {Visitor} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class VisitorService extends BaseService {

  constructor() {
    super('admin/visitor')
  }

  confirm(id: number): Observable<Visitor> {
    return this.put(id + '/confirm', {})
  }

}
