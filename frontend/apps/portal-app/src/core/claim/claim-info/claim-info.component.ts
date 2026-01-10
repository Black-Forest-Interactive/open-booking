import {Component, computed, DestroyRef, input, signal} from '@angular/core';
import {Claim} from "@open-booking/core";
import {DateTime} from "luxon";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-claim-info',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './claim-info.component.html',
  styleUrl: './claim-info.component.scss',
})
export class ClaimInfoComponent {
  data = input<Claim>()

  expires = computed(() => this.data()?.expires)
  currentTime = signal(DateTime.utc())

  expirationDate = computed(() => {
    const expiresValue = this.expires()
    if (!expiresValue) return null

    try {
      return DateTime.fromISO(expiresValue, {zone: 'utc'})
    } catch {
      return null
    }
  })

  timeRemaining = computed(() => {
    const expiration = this.expirationDate()
    if (!expiration || !expiration.isValid) return null

    const now = this.currentTime()
    return expiration.diff(now, ['days', 'hours', 'minutes', 'seconds'])
  })

  timeRemainingText = computed(() => {
    const diff = this.timeRemaining()

    if (!diff) {
      return '0s';
    }

    const duration = diff.shiftTo('days', 'hours', 'minutes', 'seconds')
    const days = Math.floor(duration.days)
    const hours = Math.floor(duration.hours)
    const minutes = Math.floor(duration.minutes)
    const seconds = Math.floor(duration.seconds)

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else if (seconds > 0) {
      return `${seconds}s`
    } else {
      return '0s'
    }
  })

  constructor(private destroyRef: DestroyRef) {
    const interval = setInterval(() => {
      this.currentTime.set(DateTime.utc())
    }, 1000)

    this.destroyRef.onDestroy(() => {
      clearInterval(interval)
    })
  }


}
