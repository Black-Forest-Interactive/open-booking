import {Injectable} from "@angular/core";
import {BaseService} from "@open-booking/shared";
import {Observable} from "rxjs";
import {DayInfoOffer} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class OfferService extends BaseService {

  constructor() {
    super('portal/offer')
  }

  getOffer(offerId: number): Observable<DayInfoOffer> {
    return this.get('offer/' + offerId)
  }
}
