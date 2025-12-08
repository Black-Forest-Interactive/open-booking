import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {

  constructor() {
    super('admin/role')
  }


}
