import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {StaffMember, StaffMemberChangeRequest} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class StaffService extends BaseService {

  constructor() {
    super('admin/staff')
  }


  getAllStaffMember(page: number, size: number): Observable<Page<StaffMember>> {
    return this.getPaged('', page, size)
  }

  getStaffMember(id: number): Observable<StaffMember> {
    return this.get('' + id)
  }

  createStaffMember(request: StaffMemberChangeRequest): Observable<StaffMember> {
    return this.post('', request)
  }

  updateStaffMember(id: number, request: StaffMemberChangeRequest): Observable<StaffMember> {
    return this.put('' + id, request)
  }

  deleteStaffMember(id: number): Observable<StaffMember> {
    return this.delete('' + id)
  }
}
