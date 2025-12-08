import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";

@Injectable({
  providedIn: 'root'
})
export class GroupService extends BaseService {

  constructor() {
    super('admin/group')
  }


}
