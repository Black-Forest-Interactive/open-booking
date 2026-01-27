import {Component, computed, inject, input, resource} from '@angular/core';
import {navigateToReservation} from "../../../app/app.navigation";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map, of} from "rxjs";
import {BookingService} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {TranslatePipe} from "@ngx-translate/core";
import {LowerCasePipe} from "@angular/common";
import {BookingDetailViewComponent} from "../../booking/booking-detail-view/booking-detail-view.component";

@Component({
  selector: 'app-reservation-details',
  imports: [
    LoadingBarComponent,
    TranslatePipe,
    LowerCasePipe,
    BookingDetailViewComponent
  ],
  templateUrl: './reservation-details.component.html',
  styleUrl: './reservation-details.component.scss',
})
export class ReservationDetailsComponent {
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


  reloading = computed(() => this.bookingResource.isLoading())
  data = computed(() => this.bookingResource.value())


  constructor(
    private service: BookingService,
    protected readonly router: Router
  ) {

  }

  back() {
    navigateToReservation(this.router)
  }

  reload() {
    this.bookingResource.reload()
  }

  protected readonly navigateToReservation = navigateToReservation;
}
