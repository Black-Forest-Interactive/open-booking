import {Component, computed, inject, resource} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {RequestService} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {BookingDetailsVisitorComponent} from "../booking-details-visitor-group/booking-details-visitor-group.component";
import {BookingDetailsHeaderComponent} from "../booking-details-header/booking-details-header.component";
import {BookingDetailsCommentComponent} from "../booking-details-comment/booking-details-comment.component";
import {BookingDetailsContentComponent} from "../booking-details-content/booking-details-content.component";
import {navigateToBooking} from "../../../app/app.navigation";

@Component({
  selector: 'app-booking-details',
  imports: [
    MatButtonModule,
    MatIconModule,
    LoadingBarComponent,
    BookingDetailsVisitorComponent,
    BookingDetailsHeaderComponent,
    BookingDetailsCommentComponent,
    BookingDetailsContentComponent
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss',
})
export class BookingDetailsComponent {

  private route = inject(ActivatedRoute)
  bookingId = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private bookingRequestInfoResource = resource({
    params: this.bookingId,
    loader: param => toPromise(this.service.getInfoByBookingId(param.params), param.abortSignal)
  })

  reloading = computed(() => this.bookingRequestInfoResource.isLoading())
  data = computed(() => this.bookingRequestInfoResource.value())


  constructor(
    private service: RequestService,
    private router: Router,
  ) {
  }

  back() {
    navigateToBooking(this.router)
  }

  reload() {
    this.bookingRequestInfoResource.reload()
  }
}
