import {Component, computed, inject, resource} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {BookingDetailViewComponent} from "../booking-detail-view/booking-detail-view.component";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map, of} from "rxjs";
import {BookingService} from "@open-booking/admin";
import {toPromise} from "@open-booking/shared";
import {navigateToBooking} from "../../../app/app.navigation";

@Component({
  selector: 'app-booking-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BookingDetailViewComponent,
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent {

  // data = input.required<BookingDetails>()
  // showBackButton = input(false)
  // reloading = input.required()
  //
  // reload = output<boolean>()
  // close = output<boolean>()
  // back = output<boolean>()


  private route = inject(ActivatedRoute)
  private id = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))), {initialValue: 0})
  edit = toSignal(this.route.queryParamMap.pipe(map(param => param.get('edit') === 'true')), {initialValue: false})

  private bookingResource = resource({
    params: this.id,
    loader: (param) => {
      return toPromise(param.params ? this.service.getBookingDetails(param.params) : of(null), param.abortSignal)
    }
  })

  data = computed(() => this.bookingResource.value())
  reloading = this.bookingResource.isLoading


  constructor(private service: BookingService, private router: Router) {
  }

  protected reload() {
    this.bookingResource.reload()
  }

  protected back() {
    navigateToBooking(this.router)
  }
}
