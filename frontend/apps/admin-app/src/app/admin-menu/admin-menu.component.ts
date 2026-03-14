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
import {MatIconButton} from "@angular/material/button";
import {NgClass} from "@angular/common";
import {AdminMenuGroup} from "./admin-menu";

@Component({
  selector: 'app-admin-menu',
  imports: [
    MatIconModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    MatIconButton,
    NgClass
  ],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss',
})
export class AdminMenuComponent implements EventChangeListener {

  collapsed = signal(false)

  private pendingResource = resource({
      loader: param => toPromise(this.bookingService.getPendingAmount(), param.abortSignal)
    }
  )

  pending = computed(() => this.pendingResource.value() ?? 0)
  newReservations = signal(0)

  readonly menuGroups: AdminMenuGroup[] = [
    {
      title: 'MENU.Group.DailyBusiness',
      items: [
        {routerLink: './statistics', icon: 'analytics', text: 'MENU.Statistics'},
        {routerLink: './dashboard', icon: 'dashboard', text: 'MENU.Dashboard'},
        {routerLink: './booking', icon: 'bookmarks', text: 'MENU.Booking'},
        {routerLink: './assistant', icon: 'event_upcoming', text: 'MENU.Assistant'},
        {
          routerLink: './reservation', icon: 'thumb_up_alt', text: 'MENU.Reservation',
          badges: [
            {value: this.pending, colorClass: 'bg-yellow-200 border-yellow-600'},
            {value: this.newReservations, colorClass: 'bg-green-200 border-green-400'},
          ]
        },
        {routerLink: './visitor/list', icon: 'groups', text: 'MENU.Visitor'},
        {routerLink: './visitor/map', icon: 'travel_explore', text: 'MENU.VisitorMap'},
      ]
    },
    {
      title: 'MENU.Group.Offers',
      items: [
        {routerLink: './label', icon: 'label', text: 'MENU.Label'},
        {routerLink: './guide', icon: 'follow_the_signs', text: 'MENU.Guide'},
        {routerLink: './offer', icon: 'local_offer', text: 'MENU.Offer'},
      ]
    },
    {
      title: 'MENU.Group.Settings',
      items: [
        {routerLink: './settings', icon: 'settings', text: 'MENU.Settings'},
        {routerLink: './notification', icon: 'mail', text: 'MENU.Notification'},
        {routerLink: './response', icon: 'chat_bubble', text: 'MENU.Response'},
      ]
    },
    {
      title: 'MENU.Group.Administration',
      items: [
        {routerLink: './audit', icon: 'history', text: 'MENU.AuditLog'},
        {routerLink: './cache', icon: 'watch_later', text: 'MENU.Cache'},
        {routerLink: './mail', icon: 'inbox', text: 'MENU.Mail'},
        {routerLink: './search', icon: 'search_insights', text: 'MENU.Search'},
      ]
    },
  ];


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
