import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {VisitorGroup} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {

  constructor() {
    super('admin/group')
  }

  confirm(id: number): Observable<VisitorGroup> {
    return this.put(id + '/confirm', {})
  }

}
