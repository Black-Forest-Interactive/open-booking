import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {Visitor} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {

  constructor() {
    super('admin/group')
  }

  confirm(id: number): Observable<Visitor> {
    return this.put(id + '/confirm', {})
  }

}
