import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";

@Injectable({
  providedIn: 'root'
})
export class TourService extends BaseService {

  constructor() {
    super('admin/tour')
  }


}
