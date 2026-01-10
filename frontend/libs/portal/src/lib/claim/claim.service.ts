import {BaseService} from "@open-booking/shared";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Claim} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class ClaimService extends BaseService {
  constructor() {
    super('portal/claim')
  }

  createClaim(id: number): Observable<Claim> {
    return this.post(id + '', {})
  }

  deleteClaim(id: number): Observable<any> {
    return this.delete(id + '')
  }

  getClaim(): Observable<Claim> {
    return this.get('')
  }
}
