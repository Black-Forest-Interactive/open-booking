import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";

@Injectable({
  providedIn: 'root'
})
export class StaffService extends BaseService {

  constructor() {
    super('admin/staff')
  }


}
