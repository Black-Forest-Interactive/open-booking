import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";

@Injectable({
  providedIn: 'root'
})
export class ExportService extends BaseService {

  constructor() {
    super('admin/export')
  }

}
