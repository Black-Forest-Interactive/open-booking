import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {Guide, GuideChangeRequest} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class StaffService extends BaseService {

  constructor() {
    super('admin/staff')
  }


  getAllGuide(page: number, size: number): Observable<Page<Guide>> {
    return this.getPaged('', page, size)
  }

  getGuide(id: number): Observable<Guide> {
    return this.get('' + id)
  }

  createGuide(request: GuideChangeRequest): Observable<Guide> {
    return this.post('', request)
  }

  updateGuide(id: number, request: GuideChangeRequest): Observable<Guide> {
    return this.put('' + id, request)
  }

  deleteGuide(id: number): Observable<Guide> {
    return this.delete('' + id)
  }
}
