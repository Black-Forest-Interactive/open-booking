import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {Visitor, VisitorChangeRequest} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class VisitorService extends BaseService {

  constructor() {
    super('admin/visitor')
  }

  createVisitor(request: VisitorChangeRequest): Observable<Visitor> {
    return this.post('', request)
  }

  updateVisitor(id: number, request: VisitorChangeRequest): Observable<Visitor> {
    return this.put('' + id, request)
  }

  deleteVisitor(id: number): Observable<Visitor> {
    return this.delete('' + id)
  }

  confirm(id: number): Observable<Visitor> {
    return this.put(id + '/confirm', {})
  }

}
