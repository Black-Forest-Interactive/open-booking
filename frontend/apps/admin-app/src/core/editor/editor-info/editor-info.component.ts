import {Component, computed, effect, input, signal} from '@angular/core';
import {Editor} from "@open-booking/core";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {DateTime} from "luxon";

@Component({
  selector: 'app-editor-info',
  imports: [
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './editor-info.component.html',
  styleUrl: './editor-info.component.scss',
})
export class EditorInfoComponent {
  editor = input<Editor>()

  userName = computed(() => this.editor()?.userName ?? '')
  startedAt = computed(() => this.editor()?.startedAt ?? '')
  expires = computed(() => this.editor()?.expires ?? '')

  private intervalId: number | undefined

  private currentTime = signal(DateTime.utc())
  private expirationDate = computed(() => {
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

  constructor() {
    effect(() => {
      const hasEditor = !!this.editor()

      if (hasEditor && !this.intervalId) {
        this.startInterval()
      } else if (!hasEditor && this.intervalId) {
        this.stopInterval()
      }
    })
  }

  private startInterval() {
    this.intervalId = setInterval(() => {
      this.currentTime.set(DateTime.utc())
    }, 1000) as unknown as number
  }

  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }
}
