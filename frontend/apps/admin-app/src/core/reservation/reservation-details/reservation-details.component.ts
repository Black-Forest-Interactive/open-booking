import {Component, computed, inject, input, resource} from '@angular/core';
import {navigateToReservation} from "../../../app/app.navigation";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map, of} from "rxjs";
import {ReservationService} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {ReservationContentEntryComponent} from "../reservation-content-entry/reservation-content-entry.component";
import {TranslatePipe} from "@ngx-translate/core";
import {LowerCasePipe} from "@angular/common";

@Component({
  selector: 'app-reservation-details',
  imports: [
    LoadingBarComponent,
    ReservationContentEntryComponent,
    TranslatePipe,
    LowerCasePipe
  ],
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.scss',
})
export class ReservationDetailsComponent {
  private route = inject(ActivatedRoute)
  routeId = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))
  inputId = input<number>()


  private reservationCriteria = computed(() => this.routeId() || this.inputId())
  private reservationResource = resource({
    params: this.reservationCriteria,
    loader: param => toPromise(
      (param.params)
        ? this.service.getReservationDetails(param.params)
        : of(),
      param.abortSignal
    )
  })

  reloading = computed(() => this.reservationResource.isLoading())
  data = computed(() => this.reservationResource.value())

  constructor(
    private service: ReservationService,
    private router: Router
  ) {
  }

  back() {
    navigateToReservation(this.router)
  }

  reload() {
    this.reservationResource.reload()
  }

}
