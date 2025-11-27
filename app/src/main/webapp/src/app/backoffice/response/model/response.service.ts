import {Injectable} from '@angular/core';
import {BaseService} from "../../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../../shared/logging/logging.service";
import {Observable} from "rxjs";
import {Page} from "../../../shared/page/page";
import {Response, ResponseChangeRequest} from "./response-api";

@Injectable({
  providedIn: 'root'
})
export class ResponseService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService) {
    super(http, 'backend/response', logging)
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
