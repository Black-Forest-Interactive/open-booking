import {computed, Injectable, signal} from "@angular/core";
import {DayInfoHelper, DayInfoOffer} from "@open-booking/core";
import {CreateReservationRequest} from "@open-booking/portal";

@Injectable({
  providedIn: 'root'
})
export class ReservationProcessService {

  entries = signal<DayInfoOffer[]>([])
  preferredEntry = signal<DayInfoOffer | undefined>(undefined)
  maxGroupSize = computed(() => this.calcMaxGroupSize(this.entries()))

  mode = signal<'checkout' | 'summary'>('checkout')

  request = signal<CreateReservationRequest | undefined>(undefined)

  offerAdd(offer: DayInfoOffer) {
    this.entries.update(entries => [offer])
    this.preferredEntry.set(offer)
  }

  offerRemove(offer: DayInfoOffer) {
    this.entries.update(entries =>
      entries.filter(o => o.offer.id !== offer.offer.id)
    )

    if (this.preferredEntry() === offer) {
      this.preferredEntry.set(this.entries()[0])
    }
  }

  setPreferred(offer: DayInfoOffer) {
    this.offerAdd(offer)
    this.preferredEntry.set(offer)
  }


  private calcMaxGroupSize(offers: DayInfoOffer[]) {
    if (offers.length === 0) return 0

    let availableSizes = offers.map(o => DayInfoHelper.getSpaceAvailable(o))
    return Math.min(...availableSizes)
  }

  clear() {
    this.entries.set([])
    this.preferredEntry.set(undefined)
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
