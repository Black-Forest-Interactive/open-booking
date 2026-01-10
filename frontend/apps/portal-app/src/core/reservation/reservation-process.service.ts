import {computed, Injectable, signal} from "@angular/core";
import {Claim, DayInfoOffer} from "@open-booking/core";
import {CreateReservationRequest, ReservationService} from "@open-booking/portal";

@Injectable({
  providedIn: 'root'
})
export class ReservationProcessService {

  selectedOffer = signal<DayInfoOffer | undefined>(undefined)
  maxGroupSize = computed(() => this.selectedOffer()?.assignment.availableSpace)
  claim = signal<Claim | undefined>(undefined)

  mode = signal<'checkout' | 'summary'>('checkout')

  request = signal<CreateReservationRequest | undefined>(undefined)

  constructor(private service: ReservationService) {
  }

  select(offer: DayInfoOffer) {
    this.selectedOffer.set(offer)
    this.service.claim(offer.offer.id).subscribe(value => this.claim.set(value))
  }

  unselect() {
    this.selectedOffer.set(undefined)
    let claim = this.claim()
    if (claim) this.service.release(claim.id).subscribe()
  }

  clear() {
    this.selectedOffer.set(undefined)
    this.claim.set(undefined)
    this.request.set(undefined)
    this.mode.set('checkout')
  }


  proceedToCheckout() {
    this.mode.set('checkout')
  }

  proceedToSummary(request: CreateReservationRequest) {
    this.request.set(request)
    this.mode.set('summary')
  }

}
