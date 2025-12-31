import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {Label, LabelChangeRequest} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class LabelService extends BaseService {

  constructor() {
    super('admin/label')
  }

  getAllLabel(page: number, size: number): Observable<Page<Label>> {
    return this.getPaged('', page, size)
  }

  getAllLabelSorted(): Observable<Label[]> {
    return this.get('sorted')
  }

  getLabel(id: number): Observable<Label> {
    return this.get('' + id)
  }

  createLabel(request: LabelChangeRequest): Observable<Label> {
    return this.post('', request)
  }

  updateLabel(id: number, request: LabelChangeRequest): Observable<Label> {
    return this.put('' + id, request)
  }

  deleteLabel(id: number): Observable<Label> {
    return this.delete('' + id)
  }
}
