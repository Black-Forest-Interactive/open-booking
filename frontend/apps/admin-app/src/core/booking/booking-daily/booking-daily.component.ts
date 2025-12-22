import {Component, computed, inject, resource} from '@angular/core';
import {OfferService} from "@open-booking/admin";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {DatePipe} from "@angular/common";
import {BookingDailyEntryComponent} from "../booking-daily-entry/booking-daily-entry.component";
import {navigateToBooking} from "../../../app/app.navigation";

@Component({
  selector: 'app-booking-daily',
  imports: [
    MatIconModule,
    MatButtonModule,
    DatePipe,
    LoadingBarComponent,
    BookingDailyEntryComponent
  ],
  templateUrl: './booking-daily.component.html',
  styleUrl: './booking-daily.component.scss',
})
export class BookingDailyComponent {

  private route = inject(ActivatedRoute)
  date = toSignal(this.route.paramMap.pipe(map(param => param.get('date') ?? '')))

  private offerResource = resource({
    params: this.date,
    loader: param => toPromise(this.service.findOfferByDate(param.params), param.abortSignal)
  })

  reloading = computed(() => this.offerResource.isLoading())
  offer = computed(() => this.offerResource.value() ?? [])

  constructor(
    private service: OfferService,
    private router: Router
  ) {
  }

  back() {
    navigateToBooking(this.router)
  }

}
