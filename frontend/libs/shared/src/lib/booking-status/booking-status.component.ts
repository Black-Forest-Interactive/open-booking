import {Component, computed, input} from '@angular/core';
import {BookingStatus} from "@open-booking/core";
import {MatIconModule} from "@angular/material/icon";
import {StatusBadgeComponent} from "../status-badge/status-badge.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslatePipe} from "@ngx-translate/core";

const bookingClasses: Record<string, string> = {
  UNKNOWN: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-orange-100 text-orange-800',
  CANCELLED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-gray-100 text-gray-800'
}

const bookingIcons: Record<string, string> = {
  UNKNOWN: 'help_outline',
  PENDING: 'schedule',
  CONFIRMED: 'check_circle',
  DECLINED: 'cancel',
  CANCELLED: 'block',
  EXPIRED: 'event_busy'
}

const badgeClasses: Record<string, string> = {
  UNKNOWN: 'bg-gray-200 text-gray-800 border-gray-800',
  PENDING: 'bg-blue-200 text-blue-800 border-blue-800',
  CONFIRMED: 'bg-green-200 text-green-800 border-green-800',
  DECLINED: 'bg-orange-200 text-orange-800 border-orange-800',
  CANCELLED: 'bg-red-200 text-red-800 border-red-800',
  EXPIRED: 'bg-gray-200 text-gray-800 border-gray-800'
}

@Component({
  selector: 'lib-booking-status',
  imports: [
    MatIconModule,
    MatTooltipModule,
    StatusBadgeComponent,
    TranslatePipe
  ],
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss'],
})
export class BookingStatusComponent {
  status = input.required<BookingStatus>()
  showText = input(true)
  compact = input(false)
  amount = input(0)

  statusClass = computed(() => bookingClasses[this.status()] || 'bg-gray-100 text-gray-800')
  badgeClass = computed(() => badgeClasses[this.status()] || 'bg-gray-200 text-gray-800')
  text = computed(() => 'BOOKING.Status.' + this.status())
  icon = computed(() => bookingIcons[this.status()] || 'flat')

}
