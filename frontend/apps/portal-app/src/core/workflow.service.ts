import {computed, Injectable, signal} from "@angular/core";
import {DayInfoHelper, DayInfoOffer, Offer} from "@open-booking/core";

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  entries = signal<DayInfoOffer[]>([])
  preferredEntry = signal<DayInfoOffer | undefined>(undefined)
  maxGroupSize = computed(() => this.calcMaxGroupSize(this.entries()))


  offerAdd(offer: DayInfoOffer) {
    this.entries.update(entries =>
      entries.includes(offer) ? entries : [...entries, offer]
    )

    if (!this.preferredEntry()) {
      this.preferredEntry.set(offer)
    }
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

}

export interface CartEntry {
  offer: Offer,
  maxGroupSize: number,
  preferred: boolean
}
