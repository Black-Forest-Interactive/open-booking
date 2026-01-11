import {computed, DestroyRef, effect, Injectable, signal} from "@angular/core";
import {ClaimService} from "@open-booking/portal";
import {catchError, Observable, of, tap} from "rxjs";
import {Claim} from "@open-booking/core";
import {DateTime} from "luxon";

@Injectable({
  providedIn: 'root'
})
export class PortalClaimService {

  claim = signal<Claim | undefined>(undefined)
  claimedOfferId = computed(() => this.claim()?.id)

  private expires = computed(() => this.claim()?.expires)
  private currentTime = signal(DateTime.utc())
  private intervalId: number | undefined

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

  isExpired = computed(() => {
    const diff = this.timeRemaining()
    if (!diff) return true
    return diff.as('seconds') <= 0
  })

  constructor(private service: ClaimService, private destroyRef: DestroyRef) {
    this.updateClaim().subscribe()

    effect(() => {
      const hasClaim = !!this.claim()

      if (hasClaim && !this.intervalId) {
        this.startInterval()
      } else if (!hasClaim && this.intervalId) {
        this.stopInterval()
      }
    })

    effect(() => {
      let isExpired = this.isExpired()
      let claim = this.claim()
      if (isExpired && claim) {
        this.updateClaim().subscribe()
      }
    })

    this.destroyRef.onDestroy(() => this.stopInterval())
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


  updateClaim(): Observable<Claim | undefined> {
    return this.service.getClaim().pipe(
      tap(value => this.claim.set(value)),
      catchError(error => {
        this.claim.set(undefined)
        return of(undefined)
      })
    )
  }

  createClaim(id: number): Observable<Claim> {
    return this.service.createClaim(id).pipe(
      tap(value => this.claim.set(value))
    )
  }

  deleteClaim(id: number): Observable<any> {
    return this.service.deleteClaim(id).pipe(
      tap(() => this.claim.set(undefined))
    )
  }

}
