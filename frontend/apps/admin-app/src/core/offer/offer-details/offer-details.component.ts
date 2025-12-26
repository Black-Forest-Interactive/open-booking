import {Component, computed, inject, resource} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {OfferService} from "@open-booking/admin";
import {toPromise} from "@open-booking/shared";
import {navigateToOffer} from "../../../app/app.navigation";

@Component({
  selector: 'app-offer-details',
  imports: [],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.scss',
})
export class OfferDetailsComponent {
  private route = inject(ActivatedRoute)
  offerId = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private offerResource = resource({
    params: this.offerId,
    loader: param => toPromise(this.service.getOffer(param.params), param.abortSignal)
  })

  reloading = computed(() => this.offerResource.isLoading())
  data = computed(() => this.offerResource.value())

  constructor(
    private service: OfferService,
    private router: Router,
  ) {
  }

  back() {
    navigateToOffer(this.router)
  }

  reload() {
    this.offerResource.reload()
  }
}
