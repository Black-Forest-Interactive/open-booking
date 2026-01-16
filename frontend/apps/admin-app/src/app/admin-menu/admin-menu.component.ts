import {Component, computed, resource} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {EventChangeListener, EventService, ReservationService} from "@open-booking/admin";
import {ChangeEvent} from "@open-booking/core";
import {toPromise} from "@open-booking/shared";

@Component({
  selector: 'app-admin-menu',
  imports: [
    MatIconModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss',
})
export class AdminMenuComponent implements EventChangeListener {

  private unconfirmedResource = resource({
      loader: param => toPromise(this.reservationService.getUnconfirmedReservationAmount(), param.abortSignal)
    }
  )

  unconfirmed = computed(() => this.unconfirmedResource.value() ?? 0)

  constructor(
    private eventService: EventService,
    private reservationService: ReservationService
  ) {
  }


  ngOnInit() {
    this.eventService.subscribe(this)
  }

  ngOnDestroy() {
    this.eventService.unsubscribe(this)
  }


  handleEvent(event: ChangeEvent) {
    if (event.resourceType === 'Reservation') this.unconfirmedResource.reload()
  }

}
