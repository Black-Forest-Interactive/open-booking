import {computed, Injectable, Signal, signal} from "@angular/core";
import {Claim, DayInfo, DayInfoOffer} from "@open-booking/core";
import {CreateBookingRequest} from "@open-booking/portal";
import {Observable, of} from "rxjs";
import {PortalClaimService} from "../claim/portal-claim.service";

@Injectable({
  providedIn: 'root'
})
export class BookingProcessService {

  selectedOffer = signal<DayInfoOffer | undefined>(undefined)
  maxGroupSize = computed(() => this.selectedOffer()?.assignment.availableSpace)
  claimedOfferId: Signal<number | undefined>

  mode = signal<'checkout' | 'summary'>('checkout')

  request = signal<CreateBookingRequest | undefined>(undefined)

  constructor(private service: PortalClaimService) {
    this.claimedOfferId = service.claimedOfferId
  }

  select(offer: DayInfoOffer): Observable<Claim> {
    this.selectedOffer.set(offer)
    return this.service.createClaim(offer.offer.id)
  }

  unselect(): Observable<Claim> {
    let offer = this.selectedOffer()
    this.selectedOffer.set(undefined)
    if (offer) {
      return this.service.deleteClaim(offer.offer.id)
    } else {
      return of()
    }
  }

  updateClaim(): Observable<Claim | undefined> {
    return this.service.updateClaim()
  }

  clear() {
    this.unselect().subscribe()
    this.request.set(undefined)
    this.mode.set('checkout')
  }


  proceedToCheckout() {
    this.mode.set('checkout')
  }

  proceedToSummary(request: CreateBookingRequest) {
    this.request.set(request)
    this.mode.set('summary')
  }

  validateSelection(data: DayInfo, claim: Claim) {
    let selected = this.selectedOffer()
    let claimSelected = data.offer.find(o => o.offer.id === claim.id)
    if (!selected && claimSelected) {
      this.selectedOffer.set(claimSelected)
    }
  }
}
