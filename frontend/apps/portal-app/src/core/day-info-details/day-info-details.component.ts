import {Component, computed, effect, inject, resource} from '@angular/core';
import {DashboardService} from "@open-booking/portal";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {interval, map} from "rxjs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {AppService} from "../../app/app.service";
import {DayInfoDetailsListComponent} from "./day-info-details-list/day-info-details-list.component";
import {defaultDayInfo} from "@open-booking/core";
import {MatCard} from "@angular/material/card";
import {navigateToDashboard} from "../../app/app.navigation";
import {ReservationProcessService} from "../reservation/reservation-process.service";
import {PortalClaimService} from "../claim/portal-claim.service";

@Component({
  selector: 'app-day-info-details',
  imports: [
    LoadingBarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    DayInfoDetailsListComponent,
    MatCard,


  ],
  templateUrl: './day-info-details.component.html',
  styleUrl: './day-info-details.component.scss',
})
export class DayInfoDetailsComponent {
  private route = inject(ActivatedRoute)
  private date = toSignal(this.route.paramMap.pipe(map(params => params.get('date'))))

  private dayInfoResource = resource({
    params: this.date,
    loader: (param) => {
      return toPromise(this.service.loadDayInfo(param.params ?? ''), param.abortSignal)
    }
  })

  data = computed(() => this.dayInfoResource.value() ?? defaultDayInfo)
  reloading = this.dayInfoResource.isLoading

  constructor(
    private service: DashboardService,
    private reservationService: ReservationProcessService,
    private claimService: PortalClaimService,
    protected app: AppService,
    private router: Router) {
    interval(5000).pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.dayInfoResource.reload()
    })

    effect(() => {
      let data = this.data()
      let claim = this.claimService.claim()
      if (data && claim) {
        this.reservationService.validateSelection(data, claim)
      }
    });

  }

  protected back() {
    navigateToDashboard(this.router)
  }

  protected reload() {
    this.dayInfoResource.reload()

  }
}
