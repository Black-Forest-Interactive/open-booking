import {Component, computed, inject, input, OnDestroy, OnInit, resource} from '@angular/core';
import {navigateToReservation} from "../../../app/app.navigation";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {interval, map, of, Subject, switchMap, takeUntil} from "rxjs";
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
export class ReservationDetailsComponent implements OnInit, OnDestroy {
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

  private editorResource = resource({
    params: this.reservationCriteria,
    loader: param => toPromise(
      (param.params)
        ? this.service.createEditor(param.params)
        : of(),
      param.abortSignal
    )
  })

  reloading = computed(() => this.reservationResource.isLoading())
  data = computed(() => this.reservationResource.value())

  editor = computed(() => this.editorResource.value())

  private unsub = new Subject<void>()

  constructor(
    private service: ReservationService,
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
      let resourceId = this.reservationCriteria()
      if (resourceId) this.service.deleteEditor(resourceId).subscribe()
    }

  }

  back() {
    navigateToReservation(this.router)
  }

  reload() {
    this.reservationResource.reload()
  }

  private refreshEditor() {
    let editor = this.editor()
    return (editor) ? this.service.refreshEditor(editor.resourceId) : of()
  }

  protected readonly navigateToReservation = navigateToReservation;
}
