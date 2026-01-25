import {Component, computed, resource, signal} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingService, EventChangeListener, EventService} from "@open-booking/admin";
import {BookingStatus, ChangeEvent, ChangeEventType} from "@open-booking/core";
import {toPromise} from "@open-booking/shared";
import {interval} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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

  private pendingResource = resource({
      loader: param => toPromise(this.bookingService.getPendingAmount(), param.abortSignal)
    }
  )

  pending = computed(() => this.pendingResource.value() ?? 0)
  newReservations = signal(0)

  constructor(
    private eventService: EventService,
    private bookingService: BookingService
  ) {
    interval(5000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.pendingResource.reload())
  }


  ngOnInit() {
    this.eventService.subscribe(this)
  }

  ngOnDestroy() {
    this.eventService.unsubscribe(this)
  }


  handleEvent(event: ChangeEvent) {
    if (event.resourceType === 'Booking') {
      this.pendingResource.reload()
      if (event.type === ChangeEventType.CREATE && event.resourceStatus === BookingStatus.PENDING) {
        this.newReservations.update(value => value + 1)
      }
    }
  }

}
