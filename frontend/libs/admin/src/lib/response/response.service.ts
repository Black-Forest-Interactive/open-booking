import {Injectable} from "@angular/core";
import {BaseService, Page} from "@open-booking/shared";
import {Observable} from "rxjs";
import {Response, ResponseChangeRequest} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class ResponseService extends BaseService {

  constructor() {
    super('admin/response')
  }

  getAllResponse(page: number, size: number): Observable<Page<Response>> {
    return this.getPaged('', page, size)
  }

  getResponse(id: number): Observable<Response> {
    return this.get('' + id)
  }

  createResponse(request: ResponseChangeRequest): Observable<Response> {
    return this.post('', request)
  }

  updateResponse(id: number, request: ResponseChangeRequest): Observable<Response> {
    return this.put('' + id, request)
  }

  deleteResponse(id: number): Observable<Response> {
    return this.delete('' + id)
  }

}
