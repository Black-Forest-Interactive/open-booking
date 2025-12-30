import {computed, Injectable, signal} from "@angular/core";
import {CreateBookingRequest, DayInfoHelper, DayInfoOffer} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class BookingProcessService {

  entries = signal<DayInfoOffer[]>([])
  preferredEntry = signal<DayInfoOffer | undefined>(undefined)
  maxGroupSize = computed(() => this.calcMaxGroupSize(this.entries()))

  mode = signal<'offer' | 'checkout' | 'summary'>('offer')

  request = signal<CreateBookingRequest | undefined>(undefined)

  offerAdd(offer: DayInfoOffer) {
    this.entries.update(entries =>
      entries.includes(offer) ? entries : [...entries, offer]
    )

    if (!this.preferredEntry()) {
      this.preferredEntry.set(offer)
    }
    this.updateMode()
  }

  offerRemove(offer: DayInfoOffer) {
    this.entries.update(entries =>
      entries.filter(o => o.offer.id !== offer.offer.id)
    )

    if (this.preferredEntry() === offer) {
      this.preferredEntry.set(this.entries()[0])
    }
    this.updateMode()
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
  }

  proceedToOffer() {
    this.mode.set('offer')
  }

  proceedToCheckout() {
    if (this.entries().length > 0) {
      this.mode.set('checkout')
    } else {
      this.mode.set('offer')
    }
  }

  proceedToSummary(request: CreateBookingRequest) {
    this.request.set(request)
    this.mode.set('summary')
  }

  private updateMode() {
    // const size = this.entries().length
    // if (size == 0) {
    //   this.mode.set('offer')
    // } else if (size == 1) {
    //   this.mode.set('checkout')
    // } else {
    //   this.mode.set('offer')
    // }
  }
}
