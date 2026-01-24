import {Component, computed, inject, input, OnDestroy, OnInit, resource} from '@angular/core';
import {navigateToReservation} from "../../../app/app.navigation";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {interval, map, of, Subject, switchMap, takeUntil} from "rxjs";
import {BookingService} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {ReservationContentEntryComponent} from "../reservation-content-entry/reservation-content-entry.component";
import {TranslatePipe} from "@ngx-translate/core";
import {LowerCasePipe} from "@angular/common";
import {BookingDetailsComponent} from "../../booking/booking-details/booking-details.component";

@Component({
  selector: 'app-reservation-details',
  imports: [
    LoadingBarComponent,
    ReservationContentEntryComponent,
    TranslatePipe,
    LowerCasePipe,
    BookingDetailsComponent
  ],
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.scss',
})
export class ReservationDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute)
  routeId = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))
  inputId = input<number>()
  editMode = input(false)


  private bookingCriteria = computed(() => this.routeId() || this.inputId())
  private bookingResource = resource({
    params: this.bookingCriteria,
    loader: param => toPromise(
      (param.params)
        ? this.service.getBookingDetails(param.params)
        : of(),
      param.abortSignal
    )
  })

  private editorResource = resource({
    params: this.bookingCriteria,
    loader: param => toPromise(
      (param.params)
        ? this.service.createEditor(param.params)
        : of(),
      param.abortSignal
    )
  })

  reloading = computed(() => this.bookingResource.isLoading())
  data = computed(() => this.bookingResource.value())

  editor = computed(() => this.editorResource.value())

  private unsub = new Subject<void>()

  constructor(
    private service: BookingService,
    protected readonly router: Router
  ) {

  }


  ngOnInit() {
    interval(60000).pipe(
      takeUntil(this.unsub),
      switchMap(async () => this.refreshEditor())
    ).subscribe()
  }

  ngOnDestroy() {
    this.unsub.next()
    this.unsub.complete()

    let editor = this.editor()
    if (editor) {
      this.service.deleteEditor(editor.resourceId).subscribe()
    } else {
      let resourceId = this.bookingCriteria()
      if (resourceId) this.service.deleteEditor(resourceId).subscribe()
    }

  }

  back() {
    navigateToReservation(this.router)
  }

  reload() {
    this.bookingResource.reload()
  }

  private refreshEditor() {
    let editor = this.editor()
    return (editor) ? this.service.refreshEditor(editor.resourceId) : of()
  }

  protected readonly navigateToReservation = navigateToReservation;
}
